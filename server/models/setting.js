import {STRING, JSONB} from 'sequelize'
import {Model} from 'sequelize-classes'

export default class Setting extends Model {

  key = { type: STRING, unique: true }

  value = { type: JSONB }

}