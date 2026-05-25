document.addEventListener("DOMContentLoaded",()=>{const ant=document.getElementById("antenna_type"),b=document.getElementById("band_select"),p=document.getElementById("tx_power_w"),g=document.getElementById("gain_dbi"),l=document.getElementById("coax_loss_db"),btn=document.getElementById("calc_btn"),sb=document.getElementById("summary_band"),ew=document.getElementById("summary_erp_w"),edbw=document.getElementById("summary_erp_dbw"),edbm=document.getElementById("summary_erp_dbm"),cuts={"80":document.getElementById("cut_80m_m"),"40":document.getElementById("cut_40m_m"),"20":document.getElementById("cut_20m_m"),"15":document.getElementById("cut_15m_m"),"10":document.getElementById("cut_10m_m"),"6":document.getElementById("cut_6m_m")},ryb_m=document.getElementById("ryb_radiator_m"),ryb_ft=document.getElementById("ryb_radiator_ft"),ryb_b=document.getElementById("ryb_bands"),ryb_e=document.getElementById("ryb_eff_note"),dx=document.getElementById("dx_turbo"),vf_el=document.getElementById("vf_element"),vf_fl=document.getElementById("vf_feedline"),boost_sel=document.getElementById("boost_mode");const ants={quarter_vertical:{name:"1/4λ Vertical",model:"quarter"},five_eighths:{name:"5/8λ Vertical",model:"five8"},dx70:{name:"0.70λ DX Vertical",model:"dx70"},rybakov25:{name:"Rybakov 25 ft (9:1)",model:"rybakov"},efhw49:{name:"EFHW 49:1",model:"placeholder"},efhw64:{name:"EFHW 64:1",model:"placeholder"},efhw81:{name:"EFHW 81:1",model:"placeholder"},ocf:{name:"OCF Dipole",model:"placeholder"},fan:{name:"Fan Dipole",model:"placeholder"},doublet:{name:"Doublet",model:"placeholder"},edz:{name:"Extended Double Zepp",model:"placeholder"},loop_h:{name:"Horizontal Loop",model:"placeholder"},loop_delta:{name:"Delta Loop",model:"placeholder"},moxon:{name:"Moxon",model:"placeholder"},jpole:{name:"J-Pole",model:"placeholder"},bobtail:{name:"Bobtail Curtain",model:"placeholder"},array2:{name:"2-Element Vertical Array",model:"placeholder"},t2fd:{name:"T2FD",model:"placeholder"},tvee:{name:"Terminated Vee",model:"placeholder"},nvis_fd:{name:"NVIS Folded Dipole",model:"placeholder"}};function q(m){return 234/m*0.3048;}function updCuts(){const map={80:3.5,40:7,20:14,15:21,10:28,6:50};for(const k in map){cuts[k].textContent=q(map[k]).toFixed(2)+" m";}}function bandLbl(m){if(m<5)return"80 m";if(m<10)return"40 m";if(m<12)return"30 m";if(m<18)return"20 m";if(m<20)return"17 m";if(m<25)return"15 m";if(m<27)return"12 m";return"10 m";}function rybModel(m){if(m<5)return{ok:true,eff:0.03,note:"Very low efficiency on 80 m"};if(m<10)return{ok:true,eff:0.25,note:"Moderate efficiency on 40 m"};if(m<12)return{ok:true,eff:0.45,note:"Good efficiency on 30 m"};if(m<18)return{ok:true,eff:0.55,note:"Good efficiency on 20 m"};if(m<20)return{ok:true,eff:0.60,note:"Strong on 17 m"};if(m<25)return{ok:true,eff:0.65,note:"Strong on 15 m"};if(m<27)return{ok:true,eff:0.70,note:"Strong on 12 m"};return{ok:true,eff:0.75,note:"Strong on 10 m"};}function model_quarter(mhz){
  return{eff:1,gain:0};}

function model_five8(mhz){
  return{eff:1,gain:1.2};}

function model_dx70(mhz){
  return{eff:1,gain:5.2-2.15};}

function model_placeholder(mhz){
  return{eff:1,gain:0};}

function antennaModel(id,mhz,dxOn){
  if(dxOn&&id!=="rybakov25")return model_dx70(mhz);
  switch(id){
    case"quarter_vertical":return model_quarter(mhz);
    case"five_eighths":return model_five8(mhz);
    case"dx70":return model_dx70(mhz);
    case"rybakov25":return model_placeholder(mhz);
    default:return model_placeholder(mhz);
  }
}

function boostFactor(mode){
  switch(mode){
    case"seaside":return 1.5;
    case"elev_radials":return 1.2;
    case"reflector":return 1.6;
    case"director":return 1.4;
    case"soil_good":return 1.1;
    case"soil_poor":return 0.8;
    default:return 1;
  }
}

function vfScale(len,vf){
  return len*vf;}
function calc(){
  const mhz=parseFloat(b.value);
  const pw=parseFloat(p.value);
  const gd=parseFloat(g.value);
  const ld=parseFloat(l.value);
  const dxOn=dx.checked;
  const boost=boostFactor(boost_sel.value);
  const antId=ant.value;

  let base=antennaModel(antId,mhz,dxOn);
  let netGain=gd-ld+base.gain;
  let erp=pw*Math.pow(10,netGain/10)*boost;

  if(antId==="rybakov25"){
    const bands=[3.5,7,10.1,14,18.1,21,24.9,28];
    let list=[];
    for(const f of bands){
      const m=rybModel(f);
      const lbl=bandLbl(f);
      const effp=Math.round(m.eff*100);
      list.push(lbl+" — "+effp+"%");
    }
    ryb_m.textContent="7.62";
    ryb_ft.textContent="25";
    ryb_b.textContent=list.join(" • ");
    const sel=rybModel(mhz);
    ryb_e.textContent=sel.note;
    erp=erp*sel.eff;
  }else{
    ryb_b.textContent="Inactive";
    ryb_e.textContent="Inactive";
  }

  const dbw=10*Math.log10(Math.max(erp,1e-9));
  const dbm=dbw+30;

  sb.textContent=bandLbl(mhz);
  ew.textContent=erp.toFixed(1);
  edbw.textContent=dbw.toFixed(1);
  edbm.textContent=dbm.toFixed(1);
}

btn.addEventListener("click",calc);
updCuts();
calc();
function updatePanels(){
  const id=ant.value;
  const isRyb=id==="rybakov25";
  document.getElementById("rybakov_panel").style.display=isRyb?"block":"none";
}

ant.addEventListener("change",()=>{
  updatePanels();
  calc();
});

dx.addEventListener("change",calc);
boost_sel.addEventListener("change",calc);
vf_el.addEventListener("change",calc);
vf_fl.addEventListener("change",calc);

function populateDropdown(){
  const sel=ant;
  sel.innerHTML="";
  for(const k in ants){
    const o=document.createElement("option");
    o.value=k;
    o.textContent=ants[k].name;
    sel.appendChild(o);
  }
}

populateDropdown();
updatePanels();
calc();

