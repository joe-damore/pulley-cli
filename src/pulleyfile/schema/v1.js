/**
 * @file Pulleyfile schema v1.
 */

/**
 * JSONSchema schema for Pulleyfiles, v1.
 *
 * v1 Pulleyfiles must conform to this schema in order to be considered valid.
 */
const schemaV1 = {
  type: 'object',
  properties: {
    info: {
      type: 'object',
      properties: {
        name: {type: 'string'},
        author: {type: 'string'},
        version: {type: 'string'},
        description: {type: 'string'},
        schema: {type: 'string'},
        metadata: {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
        },
      },
      required: ['name'],
      additionalProperties: false,
    },
    packages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {type: 'string'},
          metadata: {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
          },
          source: {type: ['string', 'object']},
          options: {type: 'object'},
          authentication: {type: 'object'},
          after: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                action: {type: 'string'},
                options: {type: 'object'},
              },
              required: ['action'],
              additionalProperties: false,
            },
          },
        },
        required: ['name', 'source'],
        additionalProperties: false,
      },
    },
    bundler: {type: 'string'},
  },
  required: ['info', 'packages'],
  additionalProperties: false,
};

module.exports = schemaV1;
