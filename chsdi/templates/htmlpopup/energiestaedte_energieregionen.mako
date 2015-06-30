<%inherit file="base.mako"/> 

<%def name="table_body(c, lang)">
<tr>
  <td class="cell-left">${_('ch.bfe.energiestaedte-energieregionen.name')}</td>
  <td>${c['attributes']['name'] or '-'}</td>
</tr>
<tr>
  <td class="cell-left">${_('status')}</td>
 % if c['attributes']['kategorie'] == 'ker1':
  <td>
    ${_('energiestadt_region_ker1')}
  </td>
 % elif c['attributes']['kategorie'] == 'ker2':
  <td>
    ${_('energiestadt_region_ker2')}
  </td>
 % elif c['attributes']['kategorie'] == 'ker3':
  <td>
    ${_('energiestadt_region_ker3')}
  </td>
 % endif
  </tr>
</%def>
<%def name="extended_info(c, lang)">
<table class="table-with-border kernkraftwerke-extended" cellpadding="5">
  <tr>
    <th class="cell-meta">
      ${_('ch.bfe.energiestaedte-energieregionen')}
    </th>
    <td>
      ${c['attributes']['name']}
    </td>
  </tr>
  <tr>
    <th class="cell-meta">
      ${_('status')}
    </th>
  % if c['attributes']['kategorie'] == 'ker1':
    <td>
      ${_('energiestadt_region_ker1')}
    </td>
  % elif c['attributes']['kategorie'] == 'ker2':
    <td>
      ${_('energiestadt_region_ker2')}
    </td>
  % elif c['attributes']['kategorie'] == 'ker3':
    <td>
      ${_('energiestadt_region_ker3')}
    </td>
  % endif
  </tr>
  <tr>
    <th class="cell-meta">
      ${_('bet_energiestaedte')}
    </th>
    <td>
      ${c['attributes']['bet_energiestaedte'] or '-'}
    </td>
  </tr>
  <tr>
    <th class="cell-meta" >
      ${_('bet_traegerverein')}
    </th>
    <td class="cell-meta">
      ${c['attributes']['bet_traegerverein'] or '-'}
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
      <a target="_blank" href="${c['attributes']['linkberater']}">${c['attributes']['berater']}</a>
    </td>
  % endif
  </tr>
  <tr>
    <th class="cell-meta" colspan="2">
      ${_('kurzerklaerung')}
    </th>
  </tr>
  <tr>
  % if lang=='fr' :
    <td class="cell-meta" colspan="2"><p align="justify">
Le projet Région-Energie permet à des communes de mener une politique énergétique exemplaire au sens de la Stratégie énergétique 2050. Il encourage une planification et une promotion ciblées des énergies renouvelables et des mesures d’efficacité à l’échelle régionale. Les Régions-Energie peuvent poursuivre divers objectifs et stratégies à long terme allant de l’augmentation du degré d’auto-approvisionnement (remplacement des agents énergétiques fossiles importés) à l’exportation d’énergie ou de technologies par des entreprises locales. Les activités des Régions-Energie favorisent le développement économique régional et peuvent par exemple engendrer une plus-value régionale et la création d’emplois.<br><br>
Dans le cadre du programme de soutien de l’OFEN «Région-Energie», les Cités de l’énergie et les communes membres de l’association établissent dans un premier temps un bilan énergétique régional et créent un organisme responsable de la collaboration intercommunale.<br>
<a target="_blank" href="http://www.energie-region.ch/fr/programmes-de-soutien/phase-1-2014-2015/">http://www.energie-region.ch/fr/programmes-de-soutien/phase-1-2014-2015/</a><br><br>
Dans un second temps, elles choisissent et concrétisent des projets adaptés sur la base du bilan local et de l’analyse du potentiel.<br> 
<a target="_blank" href="http://www.energie-region.ch/fr/programmes-de-soutien/phase-2-2014-2015/">http://www.energie-region.ch/fr/programmes-de-soutien/phase-2-2014-2015/</a>
    </p></td>
    </tr>
    <th class="cell-meta">
      ${_('link')}
    </th>
    <td class="cell-meta">
      <a target="_blank" href="http://www.energie-region.ch/fr/region-energie/">Région-Energie</a>
    </td>
  % elif lang=='it' :
    <td class="cell-meta" colspan="2"><p align="justify">
Il progetto «Regione-Energia» consente ai Comuni che vi partecipano di diventare regioni all'avanguardia nel settore energetico ai sensi della Strategia energetica 2050. In questo ambito vengono pianificate e promosse in modo mirato le energie rinnovabili e le misure di efficienza energetica a livello regionale. Le Regioni-Energia possono perseguire nel lungo periodo diversi obiettivi e strategie: dall’aumento del proprio grado di autoapprovvigionamento (mediante la sostituzione dei vettori energetici di origine fossile importati) all’esportazione di energia o tecnologia da parte delle aziende locali. Le attività delle Regioni-Energia rappresentano delle opportunità di sviluppo dell’economia regionale che a sua volta può creare valore aggiunto e nuovi posti di lavoro nella Regione.<br><br>
Nell'ambito del programma di sostegno UFE «Regione-Energia», in una prima fase queste Città dell'energia e i Comuni membri dell'Associazione hanno allestito bilanci energetici regionali e creato organismi per la loro collaborazione intercomunale.<br>
<a target="_blank" href="http://www.energie-region.ch/it/sostegno/phase-1-2014-2015/">http://www.energie-region.ch/it/sostegno/phase-1-2014-2015/</a><br><br>
In una seconda fase, vengono scelti e attuati progetti sulla base del bilancio locale vigente e dell'analisi del potenziale.<br>
<a target="_blank" href="http://www.energie-region.ch/it/sostegno/phase-2-2014-2015/">http://www.energie-region.ch/it/sostegno/phase-2-2014-2015/</a>
    </p></td>
    </tr>
    <th class="cell-meta">
      ${_('link')}
    </th>
    <td class="cell-meta">
      <a target="_blank" href="http://www.region-energie.ch/it/regione-energia/">Regione-Energia</a>
    </td>
  % elif lang=='en' :
    <td class="cell-meta" colspan="2"><p align="justify">
The Energy-Region concept is intended to enable the involved municipalities to evolve into progressive regions in accordance with Energy Strategy 2050. Here, renewable energy use and energy efficiency measures are planned and promoted in a targeted manner at the regional level. An Energy-Region can pursue different strategies and objectives over the long term. These may range from increasing the degree of autonomous supply (through the use of imported fossil-based fuels) through to energy and technology export by companies domiciled in the region. The activities of an Energy-Region represent opportunities for regional economic development which can give rise to local value-added and the creation of jobs.<br><br>
Within the scope of the SFOE’s “Energy-Region” support programme, in an initial phase these energy cities and the municipalities affiliated to the Energy City Association carried out regional energy accounting and created their own organisations for intermunicipal cooperation.<br>
<a target="_blank" href="http://www.energie-region.ch/de/unterstuetzungsprogramm/phase-1-2014-2015/">http://www.energie-region.ch/de/unterstuetzungsprogramm/phase-1-2014-2015/</a><br><br>
In a second phase, based on the criteria arising from the existing local accounting data and an analysis of the identified potentials, projects attuned to the local circumstances are to be selected and subsequently implemented.<br>
<a target="_blank" href="http://www.energie-region.ch/de/unterstuetzungsprogramm/phase-2-2014-2015/">http://www.energie-region.ch/de/unterstuetzungsprogramm/phase-2-2014-2015/</a>
     </p></td>
    </tr>
    <th class="cell-meta">
      ${_('link')}
    </th>
    <td class="cell-meta">
      <a target="_blank" href="http://www.energie-region.ch/de/energie-region/">Energy-Region</a>
    </td>
  % else :
    <td class="cell-meta" colspan="2"><p align="justify">
Das Konzept der Energie-Region ermöglicht es den beteiligten Gemeinden, sich im Energiebereich zu fortschrittlichen Regionen im Sinne der Energiestrategie 2050 zu entwickeln. Dabei werden erneuerbare Energien und Effizienzmassnahmen gezielt auf der Stufe der Region geplant und gefördert. Energie-Regionen können langfristig unterschiedliche Strategien und Ziele verfolgen. Diese reichen von der Erhöhung des eigenen Selbstversorgungsgrads (durch Ersatz von importierten fossilen Energieträgern) bis hin zum Energie- oder Technologie-Export durch ansässige Unternehmen. Die Aktivitäten von Energie-Regionen sind Chancen für eine regionalökonomische Entwicklung, welche zu regionaler Wertschöpfung und neuen Arbeitsplätzen führen können.<br><br>
Im Rahmen des BFE Unterstützungsprogramms «Energie-Region» haben diese Energiestädte und Mitgliedergemeinden des Trägervereins in einer ersten Phase regionale Energie-Bilanzen erstellt und Trägerschaften für ihre interkommunale Zusammenarbeit gegründet.<br>
<a target="_blank" href="http://www.energie-region.ch/de/unterstuetzungsprogramm/phase-1-2014-2015/">http://www.energie-region.ch/de/unterstuetzungsprogramm/phase-1-2014-2015/</a><br><br>
In einer zweiten Phase werden basierend auf der Grundlage der bestehenden lokalen Bilanz und der Potenzialanalyse standortgerechte Projekte ausgewählt und umgesetzt.<br>
<a target="_blank" href="http://www.energie-region.ch/de/unterstuetzungsprogramm/phase-2-2014-2015/">http://www.energie-region.ch/de/unterstuetzungsprogramm/phase-2-2014-2015/</a>
    </p></td>
    </tr>
    <th class="cell-meta">
      ${_('link')}
    </th>
    <td class="cell-meta">
      <a target="_blank" href="http://www.energie-region.ch/de/energie-region/">Energie-Region</a>
    </td>
%endif
  </tr>
  % if lang=='fr' :
<tr><img class="image" src="http://www.bfe-gis.admin.ch/bilder/ch.bfe.energiestaedte-energieregionen/Sub-Logo_Energieregion_f.png" alt=""/></tr>
  % elif lang=='it' :
<tr><img class="image" src="http://www.bfe-gis.admin.ch/bilder/ch.bfe.energiestaedte-energieregionen/Sub-Logo_Energieregion_i.png" alt=""/></tr>
  % else :
<tr><img class="image" src="http://www.bfe-gis.admin.ch/bilder/ch.bfe.energiestaedte-energieregionen/Sub-Logo_Energieregion_d.png" alt=""/></tr>
  % endif
</table>
</%def>
