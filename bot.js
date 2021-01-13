import asyncio
import random

import discord
from discord import Member, Guild

client = discord.Client()

antworten = ['Ja', 'Nein', 'Vielleicht', 'Sieht so aus']


@client.event
async def on_ready():
    print('Wir sind eingeloggt als User {}'.format(client.user.name))
    client.loop.create_task(status_task())


async def status_task():
    colors = [discord.Color.red(), discord.Colour.orange(), discord.Colour.gold(), discord.Colour.green(),
              discord.Colour.blue(), discord.Colour.purple()]
    while True:
        await client.change_presence(activity=discord.Game('Bin a richtiger Leisacher'), status=discord.Status.online)
        await asyncio.sleep(5)
        await client.change_presence(activity=discord.Game('Erschaffen in Leisach'), status=discord.Status.online)
        await asyncio.sleep(5)
        guild: Guild = client.get_guild(674605178938458142)
        if guild:
            role = guild.get_role(798812389373378570)
            if role:
                if role.position < guild.get_member(client.user.id).top_role.position:
                    await role.edit(colour=random.choice(colors))


def is_not_pinned(mess):
    return not mess.pinned


@client.event
async def on_message(message):
    if message.author.bot:
        return
    if '!help' in message.content:
        await message.channel.send('**Hilfe zum Leisacher Helfer**\r\n'
                                   '!help - Zeigt diese Hilfe an')




@client.event
async def on_message(message):
    if message.author.bot:
        return
    if '!gesundheit' in message.content:
        await message.channel.send('**Ich wünsche dir viel Gesundheit**\r\n'
                                   'Daniel Johannes Senfter')
    if message.content.startswith('!clear'):
        if message.author.permissions_in(message.channel).manage_messages:
            args = message.content.split(' ')
            if len(args) == 2:
                if args[1].isdigit():
                    count = int(args[1]) + 1
                    deleted = await message.channel.purge(limit=count, check=is_not_pinned)
                    await message.channel.send('{} Nochrichtn hob i glöscht.'.format(len(deleted) - 1))
    if message.content.startswith('!8ball'):
        args = message.content.split(' ')
        if len(args) >= 2:
            frage = ' '.join(args[1:])
            mess = await message.channel.send('Ich versuche deine Frage `{0}` zu beantworten.'.format(frage))
            await  asyncio.sleep(4)
            await mess.edit(content='Ich kontaktiere das Orakel...')
            await asyncio.sleep(4)
            await mess.edit(
                content='Deine Antwort zur Frage `{0}` lautet: `{1}`'.format(frage, random.choice(antworten)))

    if message.content.startswith('!info'):
        args = message.content.split(' ')
        if len(args) == 2:
            member: Member = discord.utils.find(lambda m: args[1] in m.name, message.guild.members)
            if member:
                embed = discord.Embed(title='Userinfo für {}'.format(member.name),
                                      description='Dies ist eine Userinfo für den User {}'.format(member.mention),
                                      color=0x22a7f0)
                embed.add_field(name='Server beigetreten', value=member.joined_at.strftime('%d/%m/%Y, %H:%M:%S'),
                                inline=True)
                embed.add_field(name='Server beigetreten', value=member.created_at.strftime('%d/%m/%Y, %H:%M:%S'),
                                inline=True)
                rollen = ''
                for role in member.roles:
                    if not role.is_default():
                        rollen += '{}\r\n'.format(role.mention)
                    if rollen:
                        embed.add_field(name='rollen', value=rollen, inline=True)
                    emded.set_thumbnail(url=member.avatar_url)
                    embed.set_footer(text='Ich bin ein embedFooter')
                    mess = await message.channel.send(embed=embed)
                    await mess.add_reaction(':diamonds:')


client.run('Nzk4ODA4ODE0Mjc5MzI3NzY1.X_6arg.o-2MAEgZQrJDSFFF2bIAohseS9k')
