import { useState, useRef, useEffect } from 'react'
import './App.css'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSwappingStrategy
} from '@dnd-kit/sortable';
import TodoItem from './components/TodoItem'
import SortableItem from './components/SortableItem'
import InputForm from './components/InputForm';
import { MoonLoader,  } from 'react-spinners';
import Footer from './components/Footer';
import { restrictToParentElement } from '@dnd-kit/modifiers';

function App() {
  const [toDo, setToDo] = useState("");
  const [toDos, setToDos] = useState([]);
  const [active, setActive] = useState(-1);
  const [isloading, setIsLoading] = useState(false);

  const dateTarget = new Date();
  const formatDate = dateTarget.toLocaleDateString('en-US', { year: "numeric", month: "short", day: "numeric" })
  const baseURL = "https://demo8641672.mockable.io"
  useEffect(() => {
    const api = `${baseURL}/todo`;
    setIsLoading(true)
    fetch(api).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setToDos(data)
      }
    }).catch((error) => {
      console.log(error)
    })
      .finally(() => {
        setIsLoading(false)
      })

  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setToDos((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedToDo = toDo.trim();
    if (trimmedToDo) {
      setToDos([{ id: Date.now(), toDo, completed: false, createdAt: formatDate }, ...toDos]);
      setToDo("")
    }
  }

  function handleDelete(id) {
    console.log("id:", id)
    console.log("todos:", toDos)
    const delToDos = toDos.filter((t) => t.id !== id);
    setToDos([...delToDos])
  }


  function handleEdit(id) {
    setActive(id)
  }

  function updateValue(e, id) {
    const update = toDos.map((t) => {
      if (t.id == id) {
        t.toDo = e.target.value
      }
      return t
    })
    setToDos(update)
  }

  function handleCompletedToggle(id) {
    const completed = toDos.map((t) => {
      return id === t.id ? { ...t, completed: !t.completed } : t
    });
    setToDos(completed)
  }

  return (
    <div className='container'>
      <h1 className='title'>Create Your Tasks</h1>
      <InputForm handleSubmit={handleSubmit} toDo={toDo} setToDo={setToDo} />
      {isloading ?
        <div className='loader'>
          <MoonLoader/>
        </div>
        :
        <div className="todo--container">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToParentElement]}
            sensors={sensors}
          >
            <SortableContext
              items={toDos}
              strategy={rectSwappingStrategy}
            >
              {
                toDos.map(item =>
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    item={item}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    updateValue={updateValue}
                    handleCompletedToggle={handleCompletedToggle}
                    active={active}
                    setActive={setActive}
                  />
                )
              }
            </SortableContext>
          </DndContext>
        </div>
      }
      <Footer />
    </div>
  )
}

export default App
