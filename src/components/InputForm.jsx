import React from 'react';

function InputForm(props) {
    const { handleSubmit, toDo, setToDo } = props;
    return (
        <div className='todo__input--wrapper'>
            <form onSubmit={handleSubmit}>
                <input
                    className='todo__input'
                    type='text'
                    placeholder='Enter your To Dos..'
                    value={toDo}
                    onChange={(e) => setToDo(e.target.value)}
                />
                <button type='submit' className='todo__button'>
                    Add
                </button>
            </form>
        </div>
    );
}

export default InputForm;

