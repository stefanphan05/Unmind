interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function SessionDatePicker({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-2">Date</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className=" w-full px-3 py-5 text-sm input-field text-gray-500 focus:outline-none rounded-2xl"
      />
    </div>
  );
}
