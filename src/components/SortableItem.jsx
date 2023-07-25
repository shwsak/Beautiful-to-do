import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { Delete, Edit, Check } from './CustomIcons'

 function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
   const { item, handleDelete, handleCompletedToggle, handleEdit, updateValue, active, setActive } = props
    const t = item
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="todo--item">
      {active !== t.id &&
        <div className='todo-list__title-wrapper'>
          <input type="checkbox" name="" id={t.id} onChange={() => { handleCompletedToggle(t.id) }} checked={t.completed} />
          <label className={`todo-list__title ${t.completed ? "completed" : ""}`}>{t.toDo}</label>
        </div>
      }
      {active == t.id &&
        <textarea className='todo-list__title' value={t.toDo} disabled={active !== t.id} onChange={(e) => updateValue(e, t.id)} />
      }

      <p className="todo--time">{t.createdAt}</p>
      {active !== t.id ?
        <div className='todo--icons'>
          <div onClick={() => handleEdit(t.id)}><Edit /></div>
          <div onClick={() => { handleDelete(t.id) }}><Delete /></div>
        </div>
        :
        <div className='todo--icons'>
          <div onClick={() => { setActive(-1) }}><Check /></div>
        </div>
      }
    </div>
  );
}

export default SortableItem;