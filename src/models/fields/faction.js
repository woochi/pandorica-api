import {ORDER, NEUTRAL, CHAOS} from '../faction';

const FACTIONS = [ORDER, NEUTRAL, CHAOS];

export const faction = {type: String, enum: FACTIONS, required: true};

export default faction;
