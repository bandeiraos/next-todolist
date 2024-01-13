'use client'
import React, { useEffect, useCallback, useMemo, useState, ChangeEvent, FormEvent, useRef } from 'react'

const API_URL = '/api/tasks';
const API_DATA = {
    headers: {
        'Content-Type': 'application/json',
    }
}

const styles = {
    wrapper: 'flex w-full justify-center flex-col items-center mt-6 font-mono',
    h1: 'text-2xl',
    content: 'w-1/2 mt-2',
    listItem: 'pr-4 mt-2 bg-white rounded-xl shadow-lg flex justify-between',
    input: 'p-2 rounded shadow-lg w-full mb-6 mt-2 h-12',
    addBtn: 'hidden',
    removeBtn: 'hover:text-red-200',
    text: 'p-4 w-full cursor-pointer',
    empty: 'text-3xl flex justify-center text-gray-100/75'
}

interface Item {
    id: number,
    text: string,
    checked: boolean
}

interface IOptions {
    method?: string,
    headers?: Record<string, string>,
    body?: BodyInit
}

export default function Page() {
    const [inputVal, setInputVal] = useState('');
    const [list, setList] = useState<Array<Item>>([]);
    const [loading, setLoading] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    const callBackend = async (options: IOptions) => {
        setLoading(true);
        const opts: IOptions = { ...API_DATA, ...options };
        const send = await fetch(API_URL, opts)
        const tasks = await send.json();
        setList(tasks);
        setLoading(false);
    }

    useEffect(() => {
        callBackend({})
    }, [])

    const addTask = useCallback((text: string) => {
        const opts = {
            method: 'POST',
            body: JSON.stringify({ text })
        }
        callBackend(opts)
    }, [])

    const handleSetInputVal = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        setInputVal(evt.target.value)
    }, [setInputVal])

    const handleSubmit = useCallback((evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        if (!inputVal.length) return;

        addTask(inputVal);

        setInputVal('')
    }, [inputVal, addTask]);

    const removeItem = useCallback((item: Item) => {
        setLoading(true);
        const opts = {
            method: 'DELETE',
            body: JSON.stringify({ id: item.id })
        }
        callBackend(opts);
    }, [])

    const handleCheckItem = useCallback((item: Item) => {
        const opts = {
            method: 'PATCH',
            body: JSON.stringify({ id: item.id })
        }
        callBackend(opts)
    }, [])

    const listMemo = useMemo(() => {
        function getStyle(item: Item) {
            return item.checked ? ' line-through' : ''
        };

        if (!list.length)
            return (<span className={styles.empty}>Start adding some tasks</span>)

        return (
            <ul>
                {list.map((item: Item) => (
                    <li key={item.id} className={styles.listItem}>
                        <span className={styles.text + getStyle(item)} onClick={() => handleCheckItem(item)}>{item.text}</span>
                        <button className={styles.removeBtn} onClick={() => removeItem(item)}>X</button>
                    </li>
                ))}
            </ul>
        )
    }, [list, removeItem, handleCheckItem])

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.h1}>my tasks</h1>
            <div className={styles.content}>
                <form onSubmit={handleSubmit}>
                    <input
                        type='text'
                        onChange={handleSetInputVal}
                        value={inputVal}
                        className={styles.input} placeholder='Update my github portfolio...'
                        ref={inputRef}
                        autoFocus
                    />
                    <button type='submit' className={styles.addBtn} disabled={loading}>add</button>
                </form>
                {listMemo}
            </div>
        </div>
    )
}
