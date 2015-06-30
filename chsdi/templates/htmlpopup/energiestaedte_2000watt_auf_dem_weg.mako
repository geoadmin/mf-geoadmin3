<%inherit file="base.mako"/> 

<%def name="table_body(c, lang)">
<tr>
  <td class="cell-left">${_('ch.bfe.energiestaedte-2000watt-aufdemweg.name')}</td>
  <td>${c['attributes']['name'] or '-'}</td>
</tr>
<tr>
  <td class="cell-left">${_('status')}</td>
 % if c['attributes']['kategorie'] == 'kew1':
  <td>
    ${_('energiestadt_auf_dem_weg_kew1')}
  </td>
 % elif c['attributes']['kategorie'] == 'kew2':
  <td>
    ${_('energiestadt_auf_dem_weg_kew2')}
  </td>
 % elif c['attributes']['kategorie'] == 'kew3':
  <td>
    ${_('energiestadt_auf_dem_weg_kew3')}
  </td>
 % elif c['attributes']['kategorie'] == 'kew4':
  <td>
    ${_('energiestadt_auf_dem_weg_kew4')}
  </td>
 % endif
  </tr>
</%def>
<%def name="extended_info(c, lang)">
<table class="table-with-border kernkraftwerke-extended" cellpadding="5">
  <tr>
    <th class="cell-meta">
      ${_('auf_dem_weg_gemeinde')}
    </th>
    <td>
      ${c['attributes']['name']}
    </td>
  </tr>
<tr>
  <th class="cell-meta">${_('status')}</th>
 % if c['attributes']['kategorie'] == 'kew1':
  <td>
    ${_('energiestadt_auf_dem_weg_kew1')}
  </td>
 % elif c['attributes']['kategorie'] == 'kew2':
  <td>
    ${_('energiestadt_auf_dem_weg_kew2')}
  </td>
 % elif c['attributes']['kategorie'] == 'kew3':
  <td>
    ${_('energiestadt_auf_dem_weg_kew3')}
  </td>
 % elif c['attributes']['kategorie'] == 'kew4':
  <td>
    ${_('energiestadt_auf_dem_weg_kew4')}
  </td>
 % endif
  </tr>
  <tr>
    <th class="cell-meta">
      ${_('berater')}
    </th>
  % if c['attributes']['linkberater'] is None:
    <td class="cell-meta"> - </td>
  % else:
    <td class="cell-meta">
      <a target="_blank" href="${c['attributes']['linkberater']}">${c['attributes']['berater']}</a>
    </td>
  % endif
  </tr>
  <tr>
    <th class="cell-meta">
      ${_('faktenblatt')}
    </th>
  % if c['attributes']['linkfaktenblatt'] is None:
    <td class="cell-meta"> - </td>
  % else:
    <td class="cell-meta">
       <a target="_blank" href="${c['attributes']['linkfaktenblatt']}">${_('link')}</a>
    </td>
  % endif
  </tr>
  <tr>
    <th class="cell-meta" colspan="2">
      ${_('kurzerklaerung')}
    </th>
  </tr>
  <tr>
  % if lang=='fr':
    <td class="cell-meta" colspan="2"><p align="justify">
La société à 2000 watts reflète la volonté de construire un avenir communautaire, équitable et attrayant. Cette stratégie est axée sur deux pôles: les besoins en énergie et les émissions de gaz à effet de serre. A moyen terme, chaque habitant ne devrait consommer durablement que 2000 watts d’énergie et ne produire qu’une tonne de CO<sub>2</sub> par an. De nombreuses villes et communes se sont engagées au cours des dernières années à respecter ces objectifs et les ont intégrés à leurs directives de politique énergétique.<br></br>
<u>Label</u>: le label «Cité de l’énergie sur la voie de la Société à 2000 watts» est octroyé aux Cités de l’énergie qui se distinguent par des objectifs visionnaires et exemplaires dans le cadre de la philosophie de la société à 2000 watts. Il est décerné conjointement par l’Office fédéral de l’énergie et par l’association Cité de l’énergie.<br>
<a target="_blank" href="http://www.2000watt.ch/fr/pour-les-villes-et-les-communes/">http://www.2000watt.ch/fr/pour-les-villes-et-les-communes/</a><br><br>
<u>Communes pionnières</u>: ces dernières années, plusieurs villes et communes ont creusé l’idée d’une société à 2000 watts et ont marqué son développement de leur empreinte par leurs actions volontaristes et progressistes.<br>
<a target="_blank" href="http://www.2000watt.ch/fr/pour-les-villes-et-les-communes/avant-garde-et-modeles/">http://www.2000watt.ch/fr/pour-les-villes-et-les-communes/avant-garde-et-modeles/</a><br><br>
<u>Concept</u>: dans le cadre du programme de soutien de l’OFEN «Mise en œuvre de la société à 2000 watts», les Cités de l’énergie établissent dans un premier temps un bilan et une stratégie conformément aux critères de la société à 2000 watts afin de poursuivre des objectifs de réduction individuels. Dans un second temps, elles choisissent et concrétisent des projets adaptés sur la base du bilan local, de l’analyse du potentiel et des objectifs de réduction.<br>
<a target="_blank" href="http://www.2000watt.ch/fr/pour-les-villes-et-les-communes/programmes-de-soutien/">http://www.2000watt.ch/fr/pour-les-villes-et-les-communes/programmes-de-soutien/</a>
    </p></td>
    </tr>
    <th class="cell-meta">
      ${_('link')}
    </th>
    <td class="cell-meta">
      <a target="_blank" href="http://www.2000watt.ch/fr/pour-les-villes-et-les-communes/">Cité de l'énergie vers 2000 watts</a>
    </td>
  % elif lang=='it':
    <td class="cell-meta" colspan="2"><p align="justify">
La società a 2000 Watt è il progetto di uno scenario futuro comune, equo e allettante. Gli indicatori principali su cui si basa sono il «fabbisogno energetico» e le «emissioni di CO<sub>2</sub>»: a medio termine ogni abitante potrà consumare 2000 Watt ed emettere 1 tonnellata di CO<sub>2</sub> l'anno. Negli ultimi anni molti Comuni e città si sono impegnati a raggiungere gli obiettivi della società a 2000 Watt e li hanno integrati nelle loro direttive in materia di politica energetica.<br></br>
<u>Label</u>: il label « Città dell’energia in cammino verso la Società a 2000 Watt » è un riconoscimento che viene conferito a Città dell'energia selezionate per i loro obiettivi innovatori di ordine generale ai sensi della filosofia 2000 Watt. Il certificato viene rilasciato dall'Ufficio federale dell'energia (UFE) e dall'Associazione Città dell'energia.<br>
<a target="_blank" href="http://www.2000watt.ch/it/per-citta-e-comuni/">http://www.2000watt.ch/it/per-citta-e-comuni/</a><br><br>
<u>Città e Comuni pionieri</u>: negli ultimi anni, singole città e Comuni hanno dato un'impronta determinante e hanno contribuito allo sviluppo dell'idea di una società a 2000 Watt attraverso misure innovatrici e lungimiranti.<br>
<a target="_blank" href="http://www.2000watt.ch/it/per-citta-e-comuni/modelli-e-pionieri/">http://www.2000watt.ch/it/per-citta-e-comuni/modelli-e-pionieri/</a><br><br>
<u>Programma</u>: nell'ambito del programma di sostegno dell'UFE «Concetti 2000 Watt», in una prima fase queste città hanno elaborato bilanci e progetti sulla base dei criteri della società a 2000 Watt al fine di percorrere il proprio percorso di riduzione del consumo energetico. In una seconda fase, vengono scelti e attuati progetti adatti al luogo sulla base del bilancio locale vigente, dell'analisi del potenziale e della riduzione progressiva definita.<br>
<a target="_blank" href="http://www.2000watt.ch/it/per-citta-e-comuni/sostegno/">http://www.2000watt.ch/it/per-citta-e-comuni/sostegno/</a>
    </p></td>
    </tr>
    <th class="cell-meta">
      ${_('link')}
    </th>
    <td class="cell-meta">
      <a target="_blank" href="http://www.2000watt.ch/it/per-citta-e-comuni/">Città dell’energia verso 2000 Watt</a>
    </td>
  % elif lang=='en' :
    <td class="cell-meta" colspan="2"><p align="justify">
The idea of a “2000-watt society” is a vision for a shared, just and attractive future. The concept focuses on the two central indicators, “energy demand” and “greenhouse gas emissions”. According to the defined vision, in the medium term each resident is entitled to a permanent energy consumption of 2000 watts and an annual level of CO<sub>2</sub> emissions of not more than 1 tonne. In the past few years, a large number of municipalities and cities have undertaken a commitment to these 2000-watt goals and incorporated them into their energy policy guidelines.<br><br>
<u>Label</u>: The Energy City on the Path Towards a “2000-Watt Society” label is awarded to municipalities that pursue visionary overlying objectives in line with the 2,000-watt philosophy. The certificate is issued jointly by the Swiss Federal Office of Energy and the Energy City Association.<br>
<a target="_blank" href="http://www.2000watt.ch/fuer-staedte-und-gemeinden/">http://www.2000watt.ch/fuer-staedte-und-gemeinden/</a><br><br>
<u>Pioneering approach</u>: In the past few years, a number of cities and municipalities have signifi-cantly influenced and codetermined the development of the 2000-watt concept through their progressive actions and forward-looking approach.<br>
<a target="_blank" href="http://www.2000watt.ch/fuer-staedte-und-gemeinden/vorbilder-und-pioniere/">http://www.2000watt.ch/fuer-staedte-und-gemeinden/vorbilder-und-pioniere/</a><br><br>
<u>Concept</u>: Within the scope of the SFOE’s “2000-watt concepts” support programme, in an initial phase these energy cities began to carry out energy accounting and define concepts with the aim of embarking on their own reduction path. In a second phase, based on the criteria arising from the existing local accounting data, an anal-ysis of the identified potentials and the defined reduction path, projects attuned to the local circumstances are to be selected and subsequently implemented.<br>
<a target="_blank" href="http://www.2000watt.ch/fuer-staedte-und-gemeinden/unterstuetzungsprogramm/">http://www.2000watt.ch/fuer-staedte-und-gemeinden/unterstuetzungsprogramm/</a>
     </p></td>
    </tr>
    <th class="cell-meta">
      ${_('link')}
    </th>
    <td class="cell-meta">
      <a target="_blank" href="http://www.2000watt.ch/de/fuer-staedte-und-gemeinden/">Energy Cities on the Path 2000-Watt</a>
    </td>
  % else :
    <td class="cell-meta" colspan="2"><p align="justify"> 
Die 2000-Watt-Gesellschaft ist eine Vision für eine gemeinschaftliche, gerechte und attraktive Zukunft. Der Fokus dieses Zukunftskonzepts liegt dabei auf den beiden Leitindikatoren «Energiebedarf» und «Treibhausgasemissionen». Jedem Einwohner und jeder Einwohnerin stehen demnach mittelfristig ein dauerhafter Energiebezug von 2000 Watt und die Emissionen von 1 Tonne CO<sub>2</sub> pro Jahr zu. Viele Gemeinden und Städte haben sich in den letzten Jahren diesen 2000-Watt-Zielen verpflichtet und sie in ihre energiepolitischen Leitlinien integriert.
<br></br>
<u>Label</u>: Das Label "Energiestadt auf dem Weg in die 2000-Watt-Gesellschaft" würdigt auserlesene Energiestädte für ihre visionären, übergeordneten Zielsetzungen im Sinne der 2000-Watt-Philosophie. Das Zertifikat wird gemeinsam vom Bundesamt für Energie und vom Trägerverein Energiestadt ausgestellt. 
<br>
<a target="_blank"  href="http://www.2000watt.ch/fuer-staedte-und-gemeinden/energiestadt-auf-dem-weg/">http://www.2000watt.ch/fuer-staedte-und-gemeinden/energiestadt-auf-dem-weg/</a><br><br>
<u>Pionier</u>: Einzelne Städte und Gemeinden haben die Entwicklung der 2000-Watt-Idee durch ihr fortschrittliches und vorausdenkendes Handeln in den letzten Jahren massgeblich mitgeprägt und mitgestaltet.<br>
<a target="_blank" href="http://www.2000watt.ch/fuer-staedte-und-gemeinden/rueckblick-pioniere/">http://www.2000watt.ch/fuer-staedte-und-gemeinden/rueckblick-pioniere/</a><br><br>
<u>Konzept</u>: Im Rahmen des BFE Unterstützungsprogramms „2000-Watt-Konzepte“ haben diese Energiestädte in einer ersten Phase nach Kriterien der 2000-Watt-Gesellschaft Bilanzierungen und Konzepte erstellt, um sich auf ihren individuellen Absenkpfad begeben zu können. In einer zweiten Phase werden folgend auf der Grundlage der bestehenden lokalen Bilanz, der Potenzialanalyse und des definierten Absenkpfades standortgerechte Projekte ausgewählt und umgesetzt.<br>
<a target="_blank" href="http://www.2000watt.ch/fuer-staedte-und-gemeinden/unterstuetzungsprogramm/">http://www.2000watt.ch/fuer-staedte-und-gemeinden/unterstuetzungsprogramm/</a>
    </p></td> 
    </tr>
    <th class="cell-meta">
      ${_('link')}
    </th>
    <td class="cell-meta">
      <a target="_blank" href="http://www.2000watt.ch/de/fuer-staedte-und-gemeinden/">Energiestädte auf dem Weg 2000-Watt</a>
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
