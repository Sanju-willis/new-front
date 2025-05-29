import { useState} from 'react';
import { useAssistantStore } from '@/stores/useAssistantStore';

export function SimpleForm() {
  const [name, setName] = useState('');
  const { sendMessage } = useAssistantStore();

  return (
    <div>
      <input
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={() => sendMessage({
        input: name,
         stage: 'demo_stage',
        step: 'name_input',
      })}>
        Submit
      </button>
    </div>
  );
}
