# WebChoThuePhong_Server
Create 1 base class 
Class AuditLogSystem
{
SetFullInfo(userId,userName,model)
{
	SetCreateInfo(userId,userName,model);
	SetUpdateInfo(userId,userName,model);
}
SetCreateInfo(userId,userName,model)
{
   model.createTime = Date.now();
   model.createById = userId;
   model.createByName = userName;

  return model;
}
SetUpdateInfo(userId,userName,model){

   model.updateTime = Date.now();
   model.updateById = userId;
   model.updateByName = userName;

  return model;
}

}

export class AuditLogSystem


