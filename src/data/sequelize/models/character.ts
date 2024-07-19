import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

interface CharacterAttributes {
  id: number;
  orginal_id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: string;
}

type CharacterCreationAttributes = Optional<CharacterAttributes, "id">;

class Character
  extends Model<CharacterAttributes, CharacterCreationAttributes>
  implements CharacterAttributes
{
  public id!: number;
  public orginal_id!: number;
  public name!: string;
  public status!: string;
  public species!: string;
  public gender!: string;
  public origin!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Character.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orginal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
    },
    species: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    origin: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "character",
    tableName: "character",
    timestamps: true,
  }
);

export default Character;
