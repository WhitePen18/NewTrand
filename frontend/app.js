async function loadTrends(){
  try{
    const resp = await fetch('../data/trends.json');
    const trends = await resp.json();
    renderTrends(trends);
  }catch(e){
    console.error('Failed to load trends', e);
  }
}
function renderTrends(trends){
  const container = document.getElementById('days-container');
  container.innerHTML = '';
  const byDate = {};
  trends.forEach(t=>{ byDate[t.date] = byDate[t.date] || []; byDate[t.date].push(t); });
  Object.keys(byDate).forEach(date=>{
    const dayCard = document.createElement('div');
    dayCard.className = 'card';
    dayCard.innerHTML = `<h3>${date}</h3>`;
    byDate[date].forEach(t=>{
      const item = document.createElement('div');
      item.className = 'card';
      item.innerHTML = `<strong>${t.title}</strong> — <em>${t.source}</em><br>${t.summary}<br><a href='${t.link}' target='_blank'>อ่านรายละเอียด</a>`;
      dayCard.appendChild(item);
    });
    container.appendChild(dayCard);
  });
}
loadTrends();
