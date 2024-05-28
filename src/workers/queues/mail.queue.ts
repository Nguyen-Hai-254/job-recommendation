import Queue from 'bull';
import { RedisOpts, JobOpts } from '../../config';
import MailServices from '../../services/mailServices';

const mailQueue = new Queue('mail', { redis: RedisOpts, defaultJobOptions: {...JobOpts, priority: 2} });

mailQueue.process(async (payload, done) => {
    try {
        const { emails, subject, html } = payload.data;
        await MailServices.sendEmailForUsers(emails, subject, html);
        done()
    } catch (err) {
        done(err);
    }
});

mailQueue.on('active', (job, jobPromise) => {
    console.log('send mails started'); 
    // console.log('send mails started:', job.data);
});
  
mailQueue.on('completed', (job, result) => {
    console.log('send mails completed:', result);
  });
  
mailQueue.on('failed', (job, err) => {
    console.log('send mails failed:', err.message);
});

module.exports = mailQueue;