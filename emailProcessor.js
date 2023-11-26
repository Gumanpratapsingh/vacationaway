const { google } = require('googleapis');

const labelName = process.env.LABEL_NAME || "Vacation-Mails";

const vacationMessages = [
  "Hi, \n\nI'm currently on vacation and will get back to you soon.\n\nBest, \nGuman Pratap Singh",
  "Hello, \n\nThank you for your email. I'm out of the office at the moment and will respond once I return.\n\nBest regards, \nGuman Pratap Singh",
  "Greetings, \n\nI am currently away and unable to respond immediately. I'll reach out to you as soon as I'm back.\n\nWarm regards, \nGuman Pratap Singh",
  "Hello, \n\nI'm currently taking some time off. Your message is important to me, and I will respond as soon as I return.\n\nKind regards, \nGuman Pratap Singh",
  "Thank you for your email. I am out of the office on vacation and will not be checking my emails regularly. I’ll get back to you as soon as possible.\n\nBest wishes, \nGuman Pratap Singh",
  "Hi there, \n\nI am currently out of the office on leave. I will have limited access to my email. If this is urgent, please contact my PA.\n\nRegards, \nGuman Pratap Singh",
  "Hello, \n\nThank you for reaching out. I'm currently on leave and will be back on [30-12-2025]. I’ll address your email promptly upon my return.\n\nSincerely, \nGuman Pratap Singh",
  "Hi, \n\nI am away from my desk at the moment. For immediate assistance, please contact my PA. I will get back to your email at my earliest convenience.\n\nCheers, \nGuman Pratap Singh"
];

function getRandomVacationMessage() {
  const randomIndex = Math.floor(Math.random() * vacationMessages.length);
  return vacationMessages[randomIndex];
}

async function setupGmailClient(auth) {
  console.log("Setting up Gmail client...");
  return google.gmail({ version: 'v1', auth });
}

async function createLabel(gmail) {
  console.log("Creating label...");
  try {
    const response = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: labelName,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    });
    return response.data.id;
  } catch (error) {
    if (error.code === 409) {
      const response = await gmail.users.labels.list({
        userId: "me",
      });
      const label = response.data.labels.find(label => label.name === labelName);
      return label.id;
    } else {
      throw error;
    }
  }
}

async function getUnrepliedMessages(gmail) {
  console.log("Fetching unreplied messages...");
  const response = await gmail.users.messages.list({
    userId: "me",
    labelIds: ["INBOX"],
    q: '-in:chats -from:me -has:userlabels',
  });
  return response.data.messages || [];
}

async function addLabel(gmail, message, labelId) {
  console.log(`Adding label to message with ID: ${message.id}`);
  await gmail.users.messages.modify({
    userId: 'me',
    id: message.id,
    requestBody: {
      addLabelIds: [labelId],
      removeLabelIds: ['INBOX'],
    },
  });
}

async function sendReply(gmail, message) {
  console.log(`Sending reply to message with ID: ${message.id}`);
  const res = await gmail.users.messages.get({
    userId: 'me',
    id: message.id,
    format: 'metadata',
    metadataHeaders: ['Subject', 'From'],
  });

  const subject = res.data.payload.headers.find(header => header.name === 'Subject').value;
  const fromHeader = res.data.payload.headers.find(header => header.name === 'From').value;
  const emailMatch = fromHeader.match(/<(.+?)>/) || [null, fromHeader];
  const replyTo = emailMatch[1];

  if (!replyTo) {
    console.error('No valid email address found in From header:', fromHeader);
    return;
  }

  const replySubject = subject.startsWith('Re:') ? subject : `Re: ${subject}`;
  const replyBody = getRandomVacationMessage();

  const rawMessage = [
    `From: me`,
    `To: ${replyTo}`,
    `Subject: ${replySubject}`,
    `In-Reply-To: ${message.id}`, 
    `References: ${message.id}`,
    '',
    replyBody,
  ].join('\n');

  const encodedMessage = Buffer.from(rawMessage).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });
}

async function processEmails(auth) {
  console.log("Starting email processing...");
  const gmail = await setupGmailClient(auth);
  const labelId = await createLabel(gmail);

  while (true) {
    const messages = await getUnrepliedMessages(gmail);
    if (messages.length === 0) {
      console.log("No unreplied messages found. Waiting for next check...");
      await new Promise(resolve => setTimeout(resolve, 120000)); // 2 minutes
      continue;
    }

    for (const message of messages) {
      await sendReply(gmail, message);
      await addLabel(gmail, message, labelId);
    }

    console.log("Waiting for next check...");
    await new Promise(resolve => setTimeout(resolve, 45000)); // 45 seconds
  }
}

module.exports = {
  processEmails,
};
