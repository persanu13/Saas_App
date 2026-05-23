export function Schedule() {
  const slots = Array.from({ length: 96 }, (_, i) => {
    const h = Math.floor(i / 4);
    const m = (i % 4) * 15;
    return {
      time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      isHour: m === 0,
    };
  });

  return (
    <div className="w-full overflow-y-scroll h-full">
      <table className="w-full border-collapse">
        <tbody>
          {slots.map((slot, i) => (
            <tr
              key={i}
              className="group border-b border-border last:border-0"
              style={{
                borderBottomWidth: slot.isHour ? "2px" : "0.5px",
              }}
            >
              <td className="w-16 px-2 py-0 text-xs text-muted-foreground border-r-2 border-border align-middle h-6">
                {slot.isHour ? (
                  slot.time
                ) : (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {slot.time}
                  </span>
                )}
              </td>
              <td className="h-6 cursor-pointer hover:bg-accent transition-colors" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
