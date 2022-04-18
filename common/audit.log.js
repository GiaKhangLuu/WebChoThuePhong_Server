class AudiLogSystem {

    SetFullInfo(userId, userName, model) {
        SetCreateInfo(userId, userName, model);
        SetUpdateInfo(userId, userName, model);
    }

    SetCreateInfo(userId, userName, model) {
        model.createtime = Date.now();
        model.createbyid = userId;
        model.createbyname = userName;
        console.log(model);
        return model;
    }
    SetUpdateInfo(userId, userName, model) {

        model.updatetime = Date.now();
        model.updatebyid = userId;
        model.updatebyname = userName;

        return model;
    }
}

module.exports = new AudiLogSystem();