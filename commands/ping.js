exports.run = async (client, message) => {
    await message.channel.send('Pong :ping_pong:').then(msg => {
        msg.edit(`Pong :ping_pong: \`${Math.sqrt(((new Date() - message.createdTimestamp)/(5*2))**2)} ms\``)
    });
}

exports.help = {
    name: "ping"
}