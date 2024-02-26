require('dotenv').config();
const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

// initiate voice calls
const performVoiceCalls = async () => { 
    try {
        const tasks = await Task.find({ dueDate: { $lt: new Date() } }).populate('userId');

        tasks.forEach(async (task) => {
            const sortedUsers = task.userId.sort((a, b) => a.priority - b.priority);

            for (const user of sortedUsers) {
                try {
                    await callUser(user);
                    console.log(`Call initiated to user ${user.id} with priority ${user.priority}`);
                    break; 
                } catch (error) {
                    console.error(`Error calling user ${user.id}: ${error.message}`);
                }
            }
        });

        console.log('Voice calls initiated successfully.');
    } catch (error) {
        console.error('Error initiating voice calls:', error);
    }
};

async function callUser(user) {
    const call = await client.calls.create({
            url: 'http://demo.twilio.com/docs/voice.xml',
            to: user.phone_number,
            from: process.env.TWILIO_PHONE_NUMBER,
          })
         .then(call => console.log(call.sid));

    // Handle call status and errors if needed
    if (call.status !== 'completed') {
        throw new Error('Call not completed.');
    }
}

module.exports = performVoiceCalls;