module.exports = function(req, res){

    const fs = require('fs');
    const path = require('path');

    const resourceType = req.params.resource;
    const action = req.body.action;
    const value = req.body.value || null;

    let data = require(`../resource/${resourceType}`);

    if (action === 'update' && value !== null){

        data.old.value = data.current.value;
        data.current.value = value;

    } else if (action === 'rollback' && data.old.value !== data.current.value){

        data.current.value = data.old.value;
        data.old.value = null;

    } else {
        res.status(400).json({statusCode: 400, type: 'error', message: 'Unsupported request'});
    }

    try {
        fs.writeFileSync(path.resolve(`../slayte/resource/${resourceType}.json`), JSON.stringify(data));
        res.status(200).json({ statusCode: 200, type: 'success', message: 'Operation was successful' });
    } catch (err) {
        res.status(400).json({ statusCode: 400, type: 'error', message: err });
    }

}