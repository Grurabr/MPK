import React, { useState } from 'react';

function InputForm() {
    const [input1, setInput1] = useState(''); // Для ввода имени папки
    const [input2, setInput2] = useState(''); // Для ввода ключевого слова
    const [foundFiles, setFoundFiles] = useState([]); // Состояние для хранения найденных файлов

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:3005/find-file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ folderName: input1, fileKeyword: input2 }),
            });

            const data = await response.json();
            setFoundFiles(data.filePaths || []);
        } catch (error) {
            console.error('Virhe:', error);
        }
    };

    return (
        <div style={{ margin: '20px' }}>
            <div>
                <label>Työnumero:</label>
                <input
                    type="text"
                    value={input1}
                    onChange={(e) => setInput1(e.target.value)}
                    style={{ margin: '10px' }}
                />
            </div>
            <div>
                <label>Nimikenumero:</label>
                <input
                    type="text"
                    value={input2}
                    onChange={(e) => setInput2(e.target.value)}
                    style={{ margin: '10px' }}
                />
            </div>
            <button onClick={handleSubmit}>Etsiä</button>

            {foundFiles.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Tulokset:</h3>
                    <ul>
                        {foundFiles.map((filePath, index) => (
                            <li key={index}>
                                <a href={`http://localhost:3005/${filePath}`} target="_blank" rel="noopener noreferrer">
                                    {filePath.split('\\').pop()}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default InputForm;
