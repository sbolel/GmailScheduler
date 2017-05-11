function setupStaticLabels () {
  serviceCreateLabel(SCHEDULER_LABEL);
  serviceCreateLabel(SCHEDULER_LABEL + '/' + SCHEDULER_TIMER_LABEL);
  serviceCreateLabel(SCHEDULER_LABEL + '/' + SCHEDULER_QUEUE_LABEL);
  serviceCreateLabel(SCHEDULER_LABEL + '/' + SCHEDULER_EXTRAS_LABEL);
  serviceCreateLabel(SCHEDULER_LABEL + '/' + SCHEDULER_EXTRAS_LABEL + '/' + SCHEDULER_SMS_LABEL);
}

function sendWelcomeEmail () {
  const userPrefs = getUserPrefs(false)
  if (!userPrefs['email_welcome_sent']) {
    GmailApp.sendEmail(getActiveUserEmail(), EMAIL_WELCOME_SUBJECT, body, {
      htmlBody: '<p>Hi there,</p>' +
        '<p>Welcome to GmailScheduler. This is a free, secure, private (data is held only within your gmail account & your google app script) and convenient method to schedule outgoing messages and return messages to your inbox.</p>' +
        '<p>GmailScheduler, is an open source project and please do submit tickets on any issues that you find here https://github.com/sbolel/GmailScheduler/issues.</p>' +
        '<p>SETTINGS: Please note that you can use this link to access your settings at anytime <a href="' + SETTINGS_URL + '" target="_blank">' + SETTINGS_URL +'</a></p>'
      })
    userPrefs['email_welcome_sent'] = true
    serviceSaveProperty(userPrefs, true)
  }
}

/**
 * Outgoing Sent Message
 */
function dispatchDraft (id) {
  try {
    const message = GmailApp.getMessageById(id)
    if (message) {
      var body = message.getBody()
      const raw = message.getRawContent()

      /* Credit - YetAnotherMailMerge */
      const regMessageId = new RegExp(id, 'g')
      if (body.match(regMessageId) != null) {
        const inlineImages = {}
        const nbrOfImg = body.match(regMessageId).length
        const imgVars = body.match(/<img[^>]+>/g)
        const imgToReplace = []
        if (imgVars != null) {
          for (var i = 0; i < imgVars.length; i++) {
            if (imgVars[i].search(regMessageId) != -1) {
              var id = imgVars[i].match(/realattid=([^&]+)&/)
              if (id != null) {
                id = id[1]
                var temp = raw.split(id)[1]
                temp = temp.substr(temp.lastIndexOf('Content-Type'))
                const imgTitle = temp.match(/name="([^"]+)"/)
                var contentType = temp.match(/Content-Type: ([^;]+);/)
                contentType = (contentType != null) ? contentType[1] : 'image/jpeg'
                const b64c1 = raw.lastIndexOf(id) + id.length + 3      // first character in image base64
                const b64cn = raw.substr(b64c1).indexOf('--') - 3      // last character in image base64
                const imgb64 = raw.substring(b64c1, b64c1 + b64cn + 1) // is this fragile or safe enough?
                const imgblob = Utilities.newBlob(Utilities.base64Decode(imgb64), contentType, id) // decode and blob
                if (imgTitle != null) {
                  imgToReplace.push([imgTitle[1], imgVars[i], id, imgblob])
                }
              }
            }
          }
        }

        for (var i = 0; i < imgToReplace.length; i++) {
          inlineImages[imgToReplace[i][2]] = imgToReplace[i][3]
          const newImg = imgToReplace[i][1].replace(/src="[^\"]+\"/, "src=\"cid:" + imgToReplace[i][2] + "\"");
          body = body.replace(imgToReplace[i][1], newImg)
        }

      }

      const options = {
        attachments: message.getAttachments(),
        bcc: message.getBcc(),
        cc: message.getCc(),
        from: message.getFrom(),
        htmlBody: body,
        inlineImages: inlineImages,
        name: message.getFrom().match(/[^<]*/)[0].trim(),
        replyTo: message.getReplyTo(),
      }

      GmailApp.sendEmail(message.getTo(), message.getSubject(), body, options)
      message.moveToTrash()
      return 'Delivered'
    } else {
      return 'Message not found in Drafts'
    }

  } catch (e) {
    return e.toString()
  }
}
