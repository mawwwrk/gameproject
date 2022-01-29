<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.5" tiledversion="1.7.2" name="randomObjects" tilewidth="192" tileheight="192" tilecount="7" columns="0">
 <grid orientation="orthogonal" width="1" height="1"/>
 <tile id="0">
  <image width="26" height="30" source="KakarikoObjects_07.png"/>
 </tile>
 <tile id="1">
  <image width="30" height="32" source="KakarikoObjects_09.png"/>
 </tile>
 <tile id="2">
  <image width="32" height="43" source="StoneFrameDoor-sheet_01.png"/>
 </tile>
 <tile id="3">
  <image width="32" height="32" source="KakarikoObjects_01.png"/>
 </tile>
 <tile id="4">
  <image width="192" height="192" source="8by8.png"/>
  <objectgroup draworder="index" id="2">
   <object id="1" x="0" y="21.1964" width="192" height="170.804"/>
  </objectgroup>
 </tile>
 <tile id="5">
  <properties>
   <property name="zone" value="food"/>
  </properties>
  <image width="11" height="13" source="apple.png"/>
 </tile>
 <tile id="6">
  <properties>
   <property name="zone" value="fight"/>
  </properties>
  <image width="16" height="16" source="sword.png"/>
 </tile>
</tileset>
