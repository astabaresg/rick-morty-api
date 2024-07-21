import {
  DataTypes,
  Model,
  Optional,
  BelongsToGetAssociationMixin,
} from "sequelize";
import sequelize from "../database";
import Location from "./location";

interface CharacterAttributes {
  id: number;
  original_id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  originId: number | null;
  locationId: number | null;
}

type CharacterCreationAttributes = Optional<
  CharacterAttributes,
  "id" | "originId" | "locationId"
>;

class Character
  extends Model<CharacterAttributes, CharacterCreationAttributes>
  implements CharacterAttributes
{
  public id!: number;
  public original_id!: number;
  public name!: string;
  public status!: string;
  public species!: string;
  public gender!: string;
  public originId!: number | null;
  public locationId!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association methods
  public getOrigin!: BelongsToGetAssociationMixin<Location>;
  public getLocation!: BelongsToGetAssociationMixin<Location>;
}

Character.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    original_id: {
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
    originId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Location,
        key: "id",
      },
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Location,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "character",
    tableName: "Characters",
    timestamps: true,
  }
);

// Define associations
Character.belongsTo(Location, { as: "origin", foreignKey: "originId" });
Character.belongsTo(Location, { as: "location", foreignKey: "locationId" });

export default Character;
