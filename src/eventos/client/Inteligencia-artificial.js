const { Events, ChannelType } = require('discord.js');
const { OpenAI } = require("openai");

module.exports = {
	name: Events.MessageCreate,
	emiter: "on",
	run: async (client, message) => {

		if (message.author.bot) return;
        
		if (message.content.startsWith(`<@${client.user.id}> `)) {
    await message.channel.sendTyping()
		let messages = Array.from(await message.channel.messages.fetch({
        limit: 10,
        before: message.id
    }))
    messages = messages.map(m=>m[1])
    messages.unshift(message)

    let users = [...new Set([...messages.map(m=> m.author.username), client.user.username])]

    let lastUser = users.pop()

    let prompt = `La siguiente es una conversación entre ${users.join(", ")}, y ${lastUser}. \n\n`

    for (let i = messages.length - 1; i >= 0; i--) {
        const m = messages[i]
        prompt += `${m.author.username}: ${m.content}\n`
    }
    prompt += `${client.user.username}:`
		   
    const openai = new OpenAI({
	       apiKey: "TU_API",
    });

    const chatCompletion = await openai.chat.completions.create({
			     messages: [
             { role: "user", content: prompt.toString() },
           ],
		     	 model: 'gpt-3.5-turbo',
			     user: message.author.username,
           max_tokens: 950,
		   })
		let response = await chatCompletion.choices[0].message.content
			
		await message.reply(response.length > 1996 ? response.substr(0, 1996) + "...": response)
			
		}
	}
};
