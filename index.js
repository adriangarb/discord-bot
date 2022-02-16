const { Client, Intents, MessageActionRow, MessageButton, Message, MessageCollector, createMessageComponentCollector, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });// esto es el bot
const {prefix,token} = require('./config.json')
client.on('ready',async ()=>{
    client.channels.cache.get('943521464932519978').messages.fetch('943530565926269038').then(msg=>{
        let ifilter = i=> !i.user.bot;
        const collector = msg.createMessageComponentCollector({filter: ifilter})
        collector.on('collect',async (i)=>{
            if(i.customId === "consultor"){
                if(!i.member.roles.cache.has('943496213330800763')){
                    await i.member.roles.add('943496213330800763')
                    i.reply({content: "Se te agregó el rol <@&943496213330800763>", ephemeral: true})
                } else {
                    await i.member.roles.remove('943496213330800763')
                    i.reply({content: "Se te quitó el rol <@&943496213330800763>", ephemeral: true})
                }
            }
            if(i.customId === "contratador"){
                if(!i.member.roles.cache.has('943496420609118269')){
                    await i.member.roles.add('943496420609118269')
                    i.reply({content: "Se te agregó el rol <@&943496420609118269>", ephemeral: true})
                } else {
                   await i.member.roles.remove('943496420609118269')
                   i.reply({content: "Se te quitó el rol <@&943496420609118269>", ephemeral: true})
                }
            }
        })
    })
    console.log(`bot is ready as ${client.user.tag}`)
})
client.on('messageCreate',async (message)=>{
    if(message.author.id !== '941725899810811934'){
        const direccionDeB = '0xC02a9ACa295a06f0BE29A2EEDe3594efB5b0a081'// hay que coger la direccion de firebase
        const direccionDeA = '0xC02a9ACa295a06f0BE29A2EEDe3594efB5b0a081'
        const direccion = '0xC02a9ACa295a06f0BE29A2EEDe3594efB5b0a081' // hay que coger la direccion de firebase
        const row = new MessageActionRow()
        .addComponents([new MessageButton()
            .setCustomId('accept')
            .setLabel('✅ Accept')
            .setStyle('SUCCESS'),
            new MessageButton()
            .setCustomId('decline')
            .setLabel('❌ Decline')
            .setStyle('DANGER')]  
        );

        const time = new MessageActionRow()
            .addComponents([new MessageButton()
                .setCustomId('1')
                .setLabel('1 Hour')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('2')
                .setLabel('2 Hours')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('3')
                .setLabel('3 Hours')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('4')
                .setLabel('4 Hours')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('5')
                .setLabel('5 Hours')
                .setStyle('PRIMARY')
            ]);
            
        if((message.content.includes('!contact')  &&  Array.from(message.mentions.users).length === 0)){
            message.reply('El usuario no se ha encontrado')
        } else if((message.content.includes('!contact')  &&  Array.from(message.mentions.users).length > 0)) {
            let mentioned = Array.from(message.mentions.users)[0][1].id;
            const ifilter = i => i.user.id === message.author.id
            const m = message.channel.send({content:"¿Podrias aceptar una cita ahora?" , components: [row]})
            const collector = message.channel.createMessageComponentCollector({ ifilter, time: 15000, componentType: 'BUTTON', max: 2 })
            collector.on('collect', async (m) => {
                if(m.customId === 'accept'){
                    await m.deferReply()
                    m.editReply({content: 'cuantas horas', components: [time], ephemeral: true})
                    collector.on('collect', async(i)=>{
                        await i.deferReply()
                        let horas = i.customId
                        i.editReply({content:`La cita puede durar ${horas} horas y la direccion es ${direccion}`, ephemeral:true})
                    })
                } else if (m.customId=== 'decline') {
                    message.reply('ok no te preocupes')
                }
            });
            

        } else if(message.content.includes('!register')){
            const rowAutorol = new MessageActionRow()
            .addComponents([new MessageButton()
                .setCustomId('consultor')
                .setLabel('📲 Consultor')
                .setStyle('PRIMARY')],[
                new MessageButton()
                .setCustomId('contratador')
                .setLabel('👀 Contratador')
                .setStyle('SECONDARY')]  
            );
            const embed = new MessageEmbed()
                .setTitle('Autoroles')
                .setDescription('Hola! aqui podras asignarte un rol')
                .setColor('DARK_AQUA');
            message.channel.send({embeds: [embed],components: [rowAutorol]})    
        } else if (message.content.includes('!ticket')){
                let embed = new MessageEmbed()
                    .setTitle('Tickets')
                    .setDescription('Presiona el boton de abajo para crear un ticket.')
                    .setColor("GREEN")
                let row = new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setCustomId('ticket')
                        .setStyle('SUCCESS')
                        .setLabel('🎫 Crear Ticket')
                        )
                message.channel.send({embeds:[embed], components: [row]})
        }
    }
    
})
client.on('interactionCreate', async(interaction)=>{
    if(interaction.isButton()){
        const channelName = `ticket-${interaction.user.username}`
        if(Array.from(interaction.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').map(p=>p.name)).includes(channelName.toLowerCase().replace(' ','-'))){
            interaction.reply({content: 'Tu ticket ya ha sido creado' , ephemeral: true})
        } else if (interaction.customId === 'ticket'){
            const everyone = interaction.guild.roles.cache.find(r=>r.name==='@everyone')
            interaction.guild.channels.create(channelName,{
                type: 'GUILD_TEXT',
                parent: '943571780197576794',
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: ['VIEW_CHANNEL','SEND_MESSAGES']
                    },
                    {
                        id: everyone.id,
                        deny: ['VIEW_CHANNEL','SEND_MESSAGES']
                    }
                ]
            }).then(c=>{
                    const mensaje = new MessageEmbed()
                        .setTitle(`Bienvenido a tu ticket, ${interaction.user.username}`)
                        .setDescription('Este es la descripcion del ticket')
                        .setColor('NAVY')
                    c.send({embeds: [mensaje]})
                })
            interaction.reply({content: `<@${interaction.user.id}>, tu ticket ha sido creado correctamente`, ephemeral: true})
        }
    }  
})
client.login(token)
