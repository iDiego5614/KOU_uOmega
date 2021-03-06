import { button, buttonsRow } from "../../../utils/button"
import { CheckWinner, CurrentUser, HandOptions } from "./types"

const HANDS_WINNERS =
{
  STONE : "SCISSORS",
  PAPER : "STONE",
  SCISSORS : "PAPER"
}

const checkWinner = async ({ int , embed , bet , userChallenged , userChallenging , hands } : CheckWinner) =>
{
  const userId = int.user.id
  const handOption = int.customId as HandOptions
  const currentUser : CurrentUser = userId === userChallenging.userId ? "challenging" : "challenged"

  hands[currentUser] = handOption
  int.channel?.send(`${int.user} ya ha elegido. π`)

  const { challenged , challenging } = hands

  if (!challenged || !challenging)
    return

  try {
    if (challenged === challenging)
    {
      embed.setDescription(`<@!${userChallenging.userId}> **vs** <@!${userChallenged.userId}>
      
      Ha sido un empate. π€`)
    }
    else if (HANDS_WINNERS[challenging] === challenged)
    {
      embed.setDescription(`| π |**WINNER** <@!${userChallenging.userId}>
      
      El retador <@!${userChallenging.userId}>, se mantiene invicto con una victoria mΓ‘s y ha ganado \`$${bet}\`. π`)
      await userChallenging.updateOne({ $inc : { cash : bet } })
      await userChallenged.updateOne({ $inc : { cash : -bet } })
    }
    else
    {
      embed.setDescription(`| π |**WINNER** <@!${userChallenged.userId}>
      
      <@!${userChallenged.userId}> ha venido para acabarle la racha a <@!${userChallenging.userId}> y con esto se lleva un premio de \`$${bet}\`. π`)
      await userChallenged.updateOne({ $inc : { cash : bet } })
      await userChallenging.updateOne({ $inc : { cash : -bet } })
    }
  } catch (err) {
    console.error({ err })

    embed.setDescription(`Ha llegado un UracΓ‘n y hizo que ustedes no pudieran terminar la partida. π«`)
  }

  return int.reply({ embeds : [embed] })
}

const buttons = [
  button({ style : "PRIMARY" , emoji : "πͺ¨" , label : "Piedra" , id : "STONE" }),
  button({ style : "PRIMARY" , emoji : "π" , label : "Papel" , id : "PAPER" }),
  button({ style : "PRIMARY" , emoji : "βοΈ" , label : "Tijera" , id : "SCISSORS" })
]

export const optionsRow = buttonsRow(buttons)
export default checkWinner
