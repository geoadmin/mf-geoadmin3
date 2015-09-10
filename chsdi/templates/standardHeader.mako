<!-- Revision: $Rev$ -->
<ows:ServiceIdentification>
        <ows:Title>${metadata.title}</ows:Title>
        <ows:Abstract>${metadata.abstract}</ows:Abstract>
        % if metadata.keywords:
        <ows:Keywords>
        %   for keyword in metadata.keywords.split(','):
            <ows:Keyword>${keyword|trim}</ows:Keyword>
        %   endfor
        </ows:Keywords>
        % endif
        <ows:ServiceType>OGC WMTS</ows:ServiceType>
        <ows:ServiceTypeVersion>1.0.0</ows:ServiceTypeVersion>
        <ows:Fees>${metadata.fee}</ows:Fees>
        <ows:AccessConstraints>${metadata.accessconstraint}</ows:AccessConstraints>
</ows:ServiceIdentification>
<ows:ServiceProvider>
        <ows:ProviderName>${metadata.name}</ows:ProviderName>
        <ows:ProviderSite xlink:href="http://www.swisstopo.admin.ch"/>
        <ows:ServiceContact>
            <ows:IndividualName>David Oesch</ows:IndividualName>
            <ows:PositionName></ows:PositionName>
            <ows:ContactInfo>
                <ows:Phone>
                    <ows:Voice>+41 (0)31 / 963 21 11</ows:Voice>
                    <ows:Facsimile>+41 (0)31 / 963 24 59</ows:Facsimile>
                </ows:Phone>
                <ows:Address>
                    <ows:DeliveryPoint>swisstopo</ows:DeliveryPoint>
                    <ows:City>Bern</ows:City>
                    <ows:AdministrativeArea>BE</ows:AdministrativeArea>
                    <ows:PostalCode>3084</ows:PostalCode>
                    <ows:Country>Switzerland</ows:Country>
                    <ows:ElectronicMailAddress>webgis@swisstopo.ch</ows:ElectronicMailAddress>
                </ows:Address>
            </ows:ContactInfo>
        </ows:ServiceContact>
</ows:ServiceProvider>
