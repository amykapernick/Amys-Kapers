require('dotenv').config()

const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = async ({ context, params }) => {
    // TODO: Integrate with a spam catching service
    const spam = ['eric.jones.z.mail@gmail.com', 'ericjonesmyemail@gmail.com', 'katytrilly9@gmail.com', 'celeste.wooden@gmail.com', 'angelaballj774@yahoo.com', 'paige.ericson@gmail.com', 'ermelinda.greenlee@outlook.com']

    if (spam.includes(params.email)) {
        context.log(`Spam inquiry ${params.email}`)

        return {
            status: 403,
            headers: {
                location: params.page
            }
        }
    }

    await sgMail
        .send({
            to: process.env.FORM_EMAIL,
            ...params.msg
        })
        .then((res) => {
            context.log(res)
        },
            (err) => {
                context.log('Error!')
                context.log(err)

                return {
                    status: 302,
                    headers: {
                        location: params.page
                    }
                }
            })
        .catch((err) => {
            context.log('Error!')
            context.log(err)

            return {
                status: 302,
                headers: {
                    location: params.page
                }
            }
        })

    return {
        status: 302,
        headers: {
            // location: params.redirect
            location: 'http://localhost:3000/thanks'
        }
    }
}
