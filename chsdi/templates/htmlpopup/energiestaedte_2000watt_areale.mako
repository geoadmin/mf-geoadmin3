<%inherit file="base.mako"/> 

<%def name="table_body(c, lang)">
<tr>
  <td class="cell-left">${_('ch.bfe.energiestaedte-2000watt-areale.name')}</td>
  <td>${c['attributes']['name'] or '-'}</td>
</tr>
<tr>
  <td class="cell-left">${_('status')}</td>
 % if c['attributes']['kategorie'] == 'kwa1':
  <td>
    ${_('energiestadt_areal_kwa1')}
  </td>
 % elif c['attributes']['kategorie'] == 'kwa2':
  <td>
    ${_('energiestadt_areal_kwa2')}
  </td>
 % endif
  </tr>
<tr>
  <td class="cell-left">${_('areal_gemeinde')}</td>
  <td>${c['attributes']['gemeinde'] or '-'}</td>
</tr>
</%def>
<%def name="extended_info(c, lang)">
<table class="table-with-border kernkraftwerke-extended" cellpadding="5">
  <tr>
    <th class="cell-meta">
      ${_('ch.bfe.energiestaedte-2000watt-areale.name_watt')}
    </th>
    <td>
      ${c['attributes']['name']}
    </td>
  </tr>
<tr>
  <th class="cell-meta">${_('status')}</th>
 % if c['attributes']['kategorie'] == 'kwa1':
  <td>
    ${_('energiestadt_areal_kwa1')}
  </td>
 % elif c['attributes']['kategorie'] == 'kwa2':
  <td>
    ${_('energiestadt_areal_kwa2')}
  </td>
 % endif
  </tr>
  <tr>
    <th class="cell-meta">
      ${_('areal_gemeinde')}
    </th>
    <td>
      ${c['attributes']['gemeinde'] or '-'}
    </td>
  </tr>
  <tr>
    <th class="cell-meta">
      ${_('berater')}
    </th>
  % if c['attributes']['linkberater'] is None:
    <td class="cell-meta"> - </td>
  % else: 
   <td class="cell-meta">
      <a target="_blank" href="${c['attributes']['linkberater'] or '-'}">${c['attributes']['berater']}</a>
    </td>
  % endif
  </tr>
  <tr>
  % if lang=='fr':
    <th class="cell-meta">
      ${_('faktenblatt')}
    </th>
  % if c['attributes']['linkfaktenblatt_fr'] is None:
    <td class="cell-meta"> - </td>
  % else:
    <td class="cell-meta">
      <a target="_blank" href="${c['attributes']['linkfaktenblatt_fr']}">${_('link')}</a>
    </td>
  % endif 
  </tr>
  <tr>
    <th class="cell-meta" colspan="2">
      ${_('kurzerklaerung')}
    </th>
  </tr>
  <tr>
    <td class="cell-meta" colspan="2"><p align="justify">
Le label «Site 2000 watts» récompense des quartiers qui adoptent un comportement conforme aux principes du développement durable en matière de ressources utilisées pour la construction, l’exploitation ou la rénovation de bâtiments et pour la mobilité engendrée par l’exploitation de ces bâtiments. Ce certificat est élaboré sur la base du label «Cité de l’énergie» bien connu et du document «La voie SIA vers l’efficacité énergétique» applicable aux bâtiments. Une demande de certification «En développement» peut être déposée dès la première phase d’un projet. Le certificat est ensuite attribué en vertu de l’évaluation des objectifs et d’une convention contraignante. Il peut être octroyé jusqu’à ce que plus de 50% de la surface bâtie soit consacrée à la nouvelle affectation, conformément aux dispositions. Ensuite, il convient de démontrer que le site respecte les objectifs d’une nouvelle certification «En exploitation». Le label se fonde sur l’évaluation du système de gestion, de la communication et de la coopération, de l’édification du bâtiment et de sa gestion, de l’approvisionnement en énergie, de la gestion des déchets et de la mobilité.<br><br>
<a target="_blank" href="http://www.2000watt.ch/fr/batiments-et-sites/sites-2000-watts/">http://www.2000watt.ch/fr/batiments-et-sites/sites-2000-watts/</a>
    </p></td>
    </tr>
    <th class="cell-meta">
      ${_('link')}
    </th>
    <td class="cell-meta">
      <a target="_blank" href="http://www.2000watt.ch/fr/batiments-et-sites/sites-2000-watts/">Sites à 2000 watts</a>
    </td>
  % elif lang=='it' :
    <th class="cell-meta">
      ${_('faktenblatt')}
    </th>
  % if c['attributes']['linkfaktenblatt_it'] is None:
    <td class="cell-meta"> - </td>
  % else:
    <td class="cell-meta">
      <a target="_blank" href="${c['attributes']['linkfaktenblatt_it'] or '-'}">${_('link')}</a>
    </td>
  % endif
  </tr>
  <tr>
    <th class="cell-meta" colspan="2">
      ${_('kurzerklaerung')}
    </th>
  </tr>
  <tr>
    <td class="cell-meta" colspan="2"><p align="justify">
Il label «aree 2000 Watt» è conferito ad aree di insediamento che possono dimostrare un impiego sostenibile delle risorse per la costruzione degli edifici, la loro gestione, il loro ammodernamento e la mobilità indotta. Il certificato si basa sul noto label «Città dell’energia» in combinazione con il percorso di efficienza energetica della SIA per gli edifici. Per lo sviluppo dell'area il certificato può essere richiesto già in una prima fase di progetto e viene rilasciato dopo la valutazione dei suoi obiettivi e dell'accordo per il loro rispetto. Il certificato «area in fase di sviluppo» viene rilasciato per lo sviluppo di un'area fino a quando il 50 per cento della superficie edificata è stato assegnato al nuovo utilizzo secondo le disposizioni. Superato il 50 per cento, l'area necessita di un certificato «area operativa». Per il rilascio del label vengono valutati il sistema di gestione, la comunicazione e la cooperazione, la costruzione degli edifici, l'approvvigionamento e lo smaltimento, nonché la mobilità.<br><br>
<a target="_blank" href="http://www.2000watt.ch/it/edifici-e-aree/aree-2000-watt/">http://www.2000watt.ch/it/edifici-e-aree/aree-2000-watt/</a>
    </p></td>
    </tr>
    <th class="cell-meta">
      ${_('link')}
    </th>
    <td class="cell-meta">
      <a target="_blank" href="http://www.2000watt.ch/it/edifici-e-aree/aree-2000-watt/">Aree a 2000 Watt</a>
    </td>
  % elif lang=='en':
    <th class="cell-meta">
      ${_('faktenblatt')}
    </th>
  % if c['attributes']['linkfaktenblatt_en'] is None:
    <td class="cell-meta"> - </td>
  % else:
    <td class="cell-meta">
      <a target="_blank" href="${c['attributes']['linkfaktenblatt_en'] or '-'}">${_('link')}</a>
    </td>
  % endif
  </tr>
  <tr>
    <th class="cell-meta" colspan="2">
      ${_('kurzerklaerung')}
    </th>
  </tr>
  <tr>
    <td class="cell-meta" colspan="2"><p align="justify">
This label is an instrument that is applied to residential areas that are able to demonstrate sustainable use of resources for the construction, operation and renovation of buildings, and the mobility associated with their operation. The certificate is structured on the basis of the Energy City label in combination with the Swiss Engineers and Architects Association’s Energy Efficiency Path for Buildings. For a housing development project, an application for a certificate may already be submitted at an early stage, and the label will then be issued after an assessment has been made of the project goals and the binding agreement governing compliance with the specified objectives. A certificate for a housing development can be issued until such time as more than 50 percent of the building surface area has been handed over for the specified new purpose. This therefore means that the development has to demonstrably meet the criteria attached to the new certificate when in operation. The label is based on an assessment of the management system, communication and cooperation, the construction of the building and its operation, supply and disposal, as well as mobility.<br><br>
<a target="_blank" href="http://www.2000watt.ch/gebaeude-areale-quartiere/2000-watt-areale/">http://www.2000watt.ch/gebaeude-areale-quartiere/2000-watt-areale/</a>
     </p></td>
    </tr>
    <th class="cell-meta">
      ${_('link')}
    </th>
    <td class="cell-meta">
      <a target="_blank" href="http://www.2000watt.ch/de/gebaeude-areale-quartiere/2000-watt-areale/">2000-Watt Sites</a>
    </td>
  % else :
    <th class="cell-meta">
      ${_('faktenblatt')}
    </th>
  % if c['attributes']['linkfaktenblatt_de'] is None:
    <td class="cell-meta"> - </td>
  % else:
    <td class="cell-meta">
      <a target="_blank" href="${c['attributes']['linkfaktenblatt_de'] or '-'}">${_('link')}</a>
    </td>
  % endif
  </tr>
  <tr>
    <th class="cell-meta" colspan="2">
      ${_('kurzerklaerung')}
    </th>
  </tr>
  <tr>
    <td class="cell-meta" colspan="2"><p align="justify"> 
Das Label für 2000-Watt-Areale zeichnet Siedlungsgebiete aus, die einen nachhaltigen Umgang mit Ressourcen für die Erstellung von Gebäuden, deren Betrieb und Erneuerung und die durch den Betrieb verursachte Mobilität gesamthaft nachweisen können. Das Zertifikat ist auf Grundlage des bekannten Energiestadt-Labels in Kombination mit dem SIA-Effizienzpfad Energie für Gebäude aufgebaut. Für die Arealentwicklung kann das Zertifikat schon in einer frühen Projektphase beantragt werden und wird nach der Bewertung der Projektziele und der verpflichtenden Vereinbarung zur Einhaltung dieser Ziele erteilt. Das Zertifikat für eine Arealentwicklung kann solange erteilt werden, bis mehr als 50% der Gebäudeflächen der bestimmungsgemässen neuen Nutzung übergeben sind. Folgend muss sich das Areal einer neu aufgelegten Zertifizierung im Betrieb beweisen. Das Label beruht auf der Beurteilung vom Management-System, von Kommunikation und Kooperation, der Gebäudeerstellung und des Betriebs, der Ver- und Entsorgung sowie der Mobilität.<br><br>
<a target="_blank" href="http://www.2000watt.ch/gebaeude-areale-quartiere/2000-watt-areale/">http://www.2000watt.ch/gebaeude-areale-quartiere/2000-watt-areale/</a>
    </p></td>
    </tr>
    <th class="cell-meta">
      ${_('link')}
    </th>
    <td class="cell-meta">
      <a target="_blank" href="http://www.2000watt.ch/de/gebaeude-areale-quartiere/2000-watt-areale/">2000-Watt Areale</a>
    </td>
%endif
  </tr>
  % if lang=='fr' :
<tr><img class="image" src="http://www.bfe-gis.admin.ch/bilder/ch.bfe.energiestaedte-2000watt-aufdemweg/Sub-Logo_2000Watt_f.png" alt=""/></tr>
  % elif lang=='it' :
<tr><img class="image" src="http://www.bfe-gis.admin.ch/bilder/ch.bfe.energiestaedte-2000watt-aufdemweg/Sub-Logo_2000Watt_i.png" alt=""/></tr>
  % else :
<tr><img class="image" src="http://www.bfe-gis.admin.ch/bilder/ch.bfe.energiestaedte-2000watt-aufdemweg/Sub-Logo_2000Watt_d.png" alt=""/></tr>
  % endif
</table>
</%def>
