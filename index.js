const { Client, Intents, MessageActionRow, MessageButton, Message } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });// esto es el bot
const {prefix,token} = require('./config.json')
// const { MongoClient } = require('mongodb');
/* const uri = "mongodb+srv://adrian:botdiscord@cluster0.ekafv.mongodb.net/usuarios?retryWrites=true&w=majority";
const DBClient = new MongoClient(uri); */
/* const firebaseConfig = {
    apiKey: "AIzaSyAH9XZ5_CxWTrNtjUE-pHikz0tjTbA4T6s",
    authDomain: "discord-nft-bot-f152c.firebaseapp.com",
    databaseURL: "https://discord-nft-bot-f152c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "discord-nft-bot-f152c",
    storageBucket: "discord-nft-bot-f152c.appspot.com",
    messagingSenderId: "315261709620",
    appId: "1:315261709620:web:ee61645e3027145abe4961"
  };
const app = initializeApp(firebaseConfig);
const database = getDatabase(app) */
//creamos un objeto con la info
const data =  {
    userId: null,
    direccionMatic: null,

}
client.on('ready',async ()=>{
    // try {
    //     await DBClient.connect();
    
    //     /* await listDatabases(DBClient); */
    
    // } catch (e) {
    //     console.error(e);
    // }
    console.log(`bot is ready as ${client.user.tag}`)
    // db.collection("usuariosCollection").insertMany([
    //     { item: "journal", qty: 25, tags: ["blank", "red"], size: { h: 14, w: 21, uom: "cm" } },
    //     { item: "mat", qty: 85, tags: ["gray"], size: { h: 27.9, w: 35.5, uom: "cm" } },
    //     { item: "mousepad", qty: 25, tags: ["gel", "blue"], size: { h: 19, w: 22.85, uom: "cm" } }
    // ])
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
            
        if(message.content.includes('!contact')  &&  Array.from(message.mentions.users).length === 0){
            message.reply('No se ha podido encontrar al usuario');
        } else {
            message.reply(message.mentions.users.first().id)//id del usuario */
            client.users.fetch(message.mentions.users.first().id).then((user) => user.send({ content: '¿Podrias aceptar una cita ahora?', components: [row] })); //enviar mensaje a usuario q menciono */
            //el problem esta aqui ==>
            client.on('interactionCreate', async(interaction)=>{
                
                    //await interaction.deferUpdate() por aqui van los tiros
                    if(interaction.isButton()){
                        if(interaction.customId==='decline'){
                            await interaction.update({content: '¡Gracias por tu respuesta!', components: []})
                            //await client.users.fetch(message.mentions.users.first().id).then((user) => user.send('El usuario no puede ahora mismo'))
                        }
                        if(interaction.customId==='accept'){
/*                             ; */
                            await interaction.update({content:'¿Cuantas horas estarias dispuesto a estar?', components:[time]})
                            client.on('interactionCreate', async(interaction)=>{
                                await interaction.update('foobar');
                                /* const horas = interaction.customId
                                await interaction.update({content: "Gracias, enseguida le pondremos en contacto", components: []})
                                await client.users.fetch(message.mentions.users.first().id).then((user) => user.send(`La direccion a la que enviar el NFT es la siguiente: ${direccion} y las horas maximas que dispone el consultor son de ${horas} horas`)) */
                            })
                        }
                    }
            })
        }
    }
    
})
client.login(token)


