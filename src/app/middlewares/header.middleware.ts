import { ContextCreationError } from '@app/exceptions'
import { localization } from '@util/i18n'
import Joi from 'joi'

import { IFastifyRequest } from '@root/interfaces'

class HeaderMiddleware {
  async useMiddleware(request: IFastifyRequest) {
    try {
      await Joi.object({
        'accept-language': Joi.string().valid('en', 'id').required(),
        'x-trace-id': Joi.string().required()
      })
        .unknown()
        .validateAsync(request.headers)
        .then(value => {
          const lang = value['accept-language'] as string
          localization.i18n.setLocale(lang)
        })
    } catch (err: any) {
      throw new ContextCreationError(
        { message: 'error in context' },
        { 'x-trace-id': request.headers['x-trace-id'], detail: err?.message }
      )
    }
  }
}

module.exports.globalMiddleware = new HeaderMiddleware()
