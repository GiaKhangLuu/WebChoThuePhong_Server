
module.exports.SetCreateInfo = (userId, userName, model) => {
    model.createtime = Date.now();
    model.createbyid = userId;
    model.createbyname = userName;

    return model;
}

module.exports.SetUpdateInfo = (userId, userName, model) => {

    model.updatetime = Date.now();
    model.updatebyid = userId;
    model.updatebyname = userName;

    return model;
}

module.exports.SetFullInfo = (userId, userName, model) => {
    model = this.SetCreateInfo(userId, userName, model);
    model = this.SetUpdateInfo(userId, userName, model);
    return model;
}
