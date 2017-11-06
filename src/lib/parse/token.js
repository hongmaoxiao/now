import {
  has,
  isNumber,
  toInt,
} from '../../utils/';

const tokens = {};

export function addParseToken(token, callback) {
  let i;
  let func = callback;
  if (typeof token === 'string') {
    token = [token];
  }
  if (isNumber(callback)) {
    func = function(input, array) {
      array[callback] = toInt(input);
    };
  }
  for (i = 0; i < token.length; i++) {
    tokens[token[i]] = func;
  }
}

export function addWeekParseToken(token, callback) {
  addParseToken(token, function(input, array, config, token) {
    config._w = config._w || {};
    callback(input, config._w, config, token);
  });
}

export function addTimeToArrayFromToken(token, input, config) {
  if (input != null && has(tokens, token)) {
    tokens[token](input, config._a, config, token);
  }
}

