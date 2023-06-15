import { useEffect, useState } from "react";

const task = [
  {id: '1', title: 'minha primeira tarefa'},
  {id: '2', title: 'minha segunda tarefa'},
  {id: '3', title: 'minha terceira tarefa'},
  {id: '4', title: 'minha quarta tarefa'},
]

export default function App() {

  const [task, setTasks] = useState([])

  useEffect(() =>{

    async function fetchdata(){
      const result = await fetch('https://jsonplaceholder.typicode.com/todos')
      const resultFinal = await result.json()
      return resultFinal
    }

    fetchdata().then(res => setTasks(res))

  },[])

  return (
    <div>
      <h1>Buscador de dados</h1>
      <ol>
        {task.map((task) => {
        return (
          <li key={task.id}>{task.title}
          {task.completed ? ' - Tarefa Concluida' : null}
          </li>
        )
      })}
      </ol>
    </div>
  );
}

