import express from 'express'
import sql from 'mssql'
import { sqlConfig } from './server.js';

const pool = new sql.ConnectionPool(sqlConfig)
await pool.connect();
const routes = express.Router()


//rota GET nomeada como “/” que retorna todos os agendamentos feitos no sistema.

routes.get('/', async (req, res)=>{
   try{
        const { recordset } =  await pool.query`select * from Agendamentos`
        return res.status(200).json(recordset)
   }
   catch(error){
        return res.status(501).json('Agendamentos não encontrados')
   }
})



//rota POST nomeada como “/agendamento/novo” que recebe como parâmetro via “body” e contém data, nome do espaço, hora e o motivo da reserva 
 
routes.post('/agendamento/novo', async (req, res)=>{
    try{
        const { data, nome_espaco, hora, motivo_reserva} = req.body;
        await pool.query`insert into Agendamentos values(${data},${nome_espaco},${hora}, ${motivo_reserva} )`
        return res.status(201).json(`Inserido!`)
    }

    catch(error){
        return res.status(501).json('erro ao inserir novas informações')
    }
})



//rota DELETE nomeada como “/agendamento/excluir” que deve receber como parâmetro via URL da requisição o “id” do agendamento

routes.delete('/agendamento/excluir/:id', async (req, res)=>{
    try {
        const { id } = req.params
        await pool.query`delete from Agendamentos where id = ${id}`
        return res.status(200).json('excluido!')

    } catch (error) {
        console.log(error)
        return res.status(501).json('erro ao excluir :( ')
    }
})

export default routes