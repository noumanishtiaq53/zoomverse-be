import mongoose from "mongoose";

const generateSchema = (schemaPattern) => {
  const schema = new mongoose.Schema(schemaPattern, { timestamps: true });
  return schema;
};

const generateModel = (modelName, modelSchema) => {
  const model = mongoose.model(modelName, modelSchema);
  return model;
};

const ObjectIdType = mongoose?.Schema?.Types?.ObjectId;

export const getMongooseId = (_id) => new mongoose.Types.ObjectId(`${_id}`);

export { generateModel, generateSchema, ObjectIdType };
