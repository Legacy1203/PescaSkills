(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.PescaSkillsEventHistory=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const calendar=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"});
  function day(at){return calendar.format(new Date(at));}
  function update(saved,events,at){
    if(!Array.isArray(events)||!Number.isFinite(at))return saved;
    if(saved&&Number.isFinite(saved.updatedAt)&&at<saved.updatedAt)return saved;
    const today=day(at);
    const entries=saved?.day===today&&Array.isArray(saved.entries)?saved.entries.map(entry=>({...entry})):[];
    const seen=new Set();
    for(const event of events){
      if(!event||typeof event.name!=="string"||!event.name||!Number.isFinite(event.endsAt)||event.endsAt<at)continue;
      const kind=event.kind==="grand"?"grand":"regular";
      let entry=entries.find(row=>row.status!=="ended"&&row.name===event.name&&row.kind===kind&&!seen.has(row.id)&&(row.endsAt>at||Math.abs(row.endsAt-event.endsAt)<=30000));
      if(!entry){
        entry={id:`${at}:${kind}:${event.name}:${entries.length}`,name:event.name,kind,detectedAt:at};
        entries.push(entry);
      }
      Object.assign(entry,{endsAt:event.endsAt,lastSeenAt:at,status:"active",source:event.source});
      seen.add(entry.id);
    }
    for(const entry of entries){
      if(entry.status!=="ended"&&!seen.has(entry.id)){entry.status="ended";entry.confirmedEndedAt=at;}
    }
    return {day:today,updatedAt:at,entries};
  }
  function view(saved,now=Date.now()){
    const today=day(now);
    if(saved?.day!==today||!Array.isArray(saved.entries))return {day:today,entries:[]};
    const entries=saved.entries.map(entry=>({...entry,status:entry.status==="ended"?"ended":Number.isFinite(entry.lastSeenAt)&&now>=entry.lastSeenAt&&now-entry.lastSeenAt<=(entry.source==="background"?90000:30000)&&entry.endsAt>now?"active":"unconfirmed"}));
    entries.sort((a,b)=>b.detectedAt-a.detectedAt||a.name.localeCompare(b.name));
    return {day:today,entries};
  }
  return {day,update,view};
});
