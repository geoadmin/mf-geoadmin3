# -*- coding: utf-8 -*-

import cgi
from pyramid.view import view_config

from pyramid.httpexceptions import HTTPInternalServerError
from smtplib import SMTPException


# http://kutuma.blogspot.com/2007/08/sending-emails-via-gmail-with-python.html
@view_config(route_name='feedback', renderer='json', request_method='POST')
def feedback(self, request):
    defaultRecipient = 'webgis@swisstopo.ch'
    defaultSubject = 'Customer feedback'

    def getParam(param, defaultValue):
        val = request.params.get(param, defaultValue)
        val = val if val != '' else defaultValue
        return val

    def mail(to, subject, text, attachement):
        from email.MIMEMultipart import MIMEMultipart
        from email.MIMEBase import MIMEBase
        from email.MIMEText import MIMEText
        from email import Encoders
        import unicodedata
        import smtplib

        msg = MIMEMultipart()

        msg['To'] = to
        msg['Subject'] = subject

        msg.attach(
            MIMEText(unicodedata.normalize('NFKD',
                                           unicode(text)).encode('ascii',
                                                                 'ignore')))
        # Handle attachements
        if isinstance(attachement, cgi.FieldStorage):
            types = attachement.type.split('/')
            if len(types) != 2:
                raise HTTPInternalServerError('File type could not be determined')
            part = MIMEBase(types[0], types[1])
            filePart = attachement.file.read()
            part.set_payload(filePart)
            Encoders.encode_base64(part)
            part.add_header('Content-Disposition', 'attachment; filename="%s"' % attachement.filename)
            msg.attach(part)

        mailServer = smtplib.SMTP('127.0.0.1', 25)
        mailServer.ehlo()
        mailServer.starttls()
        mailServer.ehlo()
        # Recipients and sender are always the same
        mailServer.sendmail(to, to, msg.as_string())
        mailServer.close()

    ua = getParam('ua', 'no user-agent found')
    permalink = getParam('permalink', 'No permalink provided')
    feedback = getParam('feedback', 'No feedback provided')
    email = getParam('email', 'Anonymous')
    text = '%s just sent a feedback:\n %s. \nPermalink: %s. \n\nUser-Agent: %s'
    attachement = getParam('attachement', None)

    try:
        mail(
            defaultRecipient,
            defaultSubject,
            text % (email, feedback, permalink, ua),
            attachement
        )
    except SMTPException:
        raise HTTPInternalServerError()

    return {'success': True}
