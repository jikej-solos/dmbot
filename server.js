const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES
    ],
    partials: ['CHANNEL']
});

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', async message => {
    if (message.content.startsWith('!dmall')) {
        const leaderRoleId = '1272130099889836045'; // Replace with the actual role ID
        const member = message.guild.members.cache.get(message.author.id);

        if (!member.roles.cache.has(leaderRoleId)) {
            return message.reply('You do not have permission to use this command.');
        }

        const args = message.content.slice('!dmall'.length).trim().split(/ +/);
        const announcement = args.join(' ');
        if (!announcement) return message.channel.send('Please provide a message to announce.');

        const guildName = message.guild.name;
        const statusMessage = await message.channel.send('DMing everyone, please be patient!...');

        let count = 0;
        message.guild.members.fetch().then(members => {
            const promises = members.map(member => {
                if (!member.user.bot) {
                    return member.send(announcement).then(() => {
                        count++;
                        statusMessage.edit(`Sent to ${count} members.`);
                    }).catch(error => console.error(`Could not send DM to ${member.user.tag}.`, error));
                }
                return Promise.resolve();
            });

            Promise.all(promises).then(() => {
                statusMessage.edit(`DM'd everyone in ${guildName}.`);
            });
        }).catch(error => console.error('Error fetching members:', error));
    }

    // Command: v.friend
    if (message.content.startsWith('v.friend')) {
        const unverifiedRoleId = '1272141920080105523'; // Replace with actual Unverified role ID
        const pookiesRoleId = '1272141515354800178'; // Replace with actual Pookies role ID
        const member = message.mentions.members.first();

        if (!member) return message.reply('Please mention a member to use this command.');
        
        // Remove Unverified role and add Pookies role
        member.roles.remove(unverifiedRoleId).then(() => {
            member.roles.add(pookiesRoleId).then(() => {
                message.channel.send(`${member} has been given the Pookies role!`);
            }).catch(error => console.error(`Failed to add Pookies role to ${member.user.tag}:`, error));
        }).catch(error => console.error(`Failed to remove Unverified role from ${member.user.tag}:`, error));
    }

    // Command: v.member
    if (message.content.startsWith('v.member')) {
        const unverifiedRoleId = '1272141920080105523'; // Replace with actual Unverified role ID
        const memberRoleId = '1272141584590442590'; // Replace with actual Member role ID
        const member = message.mentions.members.first();

        if (!member) return message.reply('Please mention a member to use this command.');

        // Remove Unverified role and add Member role
        member.roles.remove(unverifiedRoleId).then(() => {
            member.roles.add(memberRoleId).then(() => {
                message.channel.send(`${member} has been given the Member role!`);
            }).catch(error => console.error(`Failed to add Member role to ${member.user.tag}:`, error));
        }).catch(error => console.error(`Failed to remove Unverified role from ${member.user.tag}:`, error));
    }
});

client.login(process.env.TOKEN);
