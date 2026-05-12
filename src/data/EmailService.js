import apiService from './ApiService'
import { contactEmail } from '../utilities'

class EmailService {
    constructor(sender = contactEmail) {
        console.log(`setting email service to sender of ${sender}`)
        this.sender = sender
    }

    allowableAdditionalConfigurationFields = ['cc', 'IsBodyHtml']

    send = async (
        to = [],
        subject = '',
        body = '',
        additionalConfiguration = {}
    ) => {
        const reqBody = {
            from: this.sender,
            to,
            subject,
            body
        }

        this.allowableAdditionalConfigurationFields.forEach(field => {
            if (additionalConfiguration[field]) {
                reqBody[field] = additionalConfiguration[field]
            }
        })

        await apiService.post('email', reqBody)
    }
}

export default EmailService
