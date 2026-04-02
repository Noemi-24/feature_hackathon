import {loadTasks} from "./TaskBoard";
import {useState} from "react";

function Search({tasks}){
    const [term, setTerm] = useState("");

    const filterTasks = tasks.filter(task => task.title.toLowerCase().includes(term.toLowerCase()));

    return(
        <div>
            <input 
                type="text" 
                placeholder="Search tasks..." 
                value={term}
                onChange={(e) => setTerm(e.target.value)}
            />
            <button onClick={filterTasks} className="btn btn-secondary btn-sm">Search</button> 

        </div>
    )
}