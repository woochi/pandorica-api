var randomstring = require('randomstring');

export function generateCode() {
  return randomstring.generate({
    length: 5,
    charset: 'alphabetic',
    capitalization: 'lowercase'
  });
}

export const code = {type: String, required: true, index: true, unique: true};

export default code;
