var http = new XMLHttpRequest();
var url = "/admin/lizard_nxt/rasterstore/add/";
var params =
  '-----------------------------9210468364413133071221869113 \n\
Content-Disposition: form-data; name="csrfmiddlewaretoken" \n\
\n\
jaBkAmGZhm8UBIx8sMtbshPCI1ZxQdDwnpVzTo8j4PXYIBH6xqEuE7aTc53kLJiQ\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="organisation"\n\
\n\
383\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="access_modifier"\n\
\n\
100\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="slug"\n\
\n\
tom9:hight:test\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="name"\n\
\n\
tom9:hight:test\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="description"\n\
\n\
tom9:hight:test\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="store_path"\n\
\n\
tom9/hight/test\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="origin_0"\n\
\n\
1970-01-01\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="origin_1"\n\
\n\
01:00:00\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="interval"\n\
\n\
1 00:00:00\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="frequency"\n\
\n\
0\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="aggregation_type"\n\
\n\
5\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="options"\n\
\n\
{}\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="supplier"\n\
\n\
20\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="supplier_code"\n\
\n\
tom9\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="last_modified_by"\n\
\n\
\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="observation_type"\n\
\n\
372\n\
-----------------------------9210468364413133071221869113\n\
Content-Disposition: form-data; name="_save"\n\
\n\
Save\n\
-----------------------------9210468364413133071221869113--';
http.open("POST", url, true);

//Send the proper header information along with the request
http.setRequestHeader("Content-type", "text/html;charset=utf-8");

http.onreadystatechange = function() {
  //Call a function when the state changes.
  if (http.readyState == 4 && http.status == 200) {
    console.log(http.responseText);
  }
};
http.send(params);

/*
!DOCTYPE html>

<html lang="en" >
<head>
<title>Add raster store | Django site admin</title>
<link rel="stylesheet" type="text/css" href="/static/admin/css/base.css" />
<link rel="stylesheet" type="text/css" href="/static/admin/css/forms.css" />


<script type="text/javascript" src="/admin/jsi18n/"></script>
<script type="text/javascript" src="/static/admin/js/core.js"></script>
<script type="text/javascript" src="/static/admin/js/vendor/jquery/jquery.js"></script>
<script type="text/javascript" src="/static/admin/js/jquery.init.js"></script>
<script type="text/javascript" src="/static/admin/js/admin/RelatedObjectLookups.js"></script>
<script type="text/javascript" src="/static/admin/js/actions.js"></script>
<script type="text/javascript" src="/static/admin/js/urlify.js"></script>
<script type="text/javascript" src="/static/admin/js/prepopulate.js"></script>
<script type="text/javascript" src="/static/admin/js/vendor/xregexp/xregexp.js"></script>
<script type="text/javascript" src="/static/admin/js/calendar.js"></script>
<script type="text/javascript" src="/static/admin/js/admin/DateTimeShortcuts.js"></script>

<meta name="robots" content="NONE,NOARCHIVE" />
</head>


<body class=" app-lizard_nxt model-rasterstore change-form"
  data-admin-utc-offset="7200">

<!-- Container -->
<div id="container">

    
    <!-- Header -->
    <div id="header">
        <div id="branding">
        
<h1 id="site-name"><a href="/admin/">Django administration</a></h1>

        </div>
        
        
        <div id="user-tools">
            
                Welcome,
                <strong>Tom</strong>.
            
            
                
                    <a href="/">View site</a> /
                
                
                    
                    
                
                
                <a href="/admin/logout/">Log out</a>
            
        </div>
        
        
        
    </div>
    <!-- END Header -->
    
<div class="breadcrumbs">
<a href="/admin/">Home</a>
&rsaquo; <a href="/admin/lizard_nxt/">Lizard_Nxt</a>
&rsaquo; <a href="/admin/lizard_nxt/rasterstore/">Raster stores</a>
&rsaquo; Add raster store
</div>

    

    
        
    

    <!-- Content -->
    <div id="content" class="colM">
        
        <h1>Add raster store</h1>
        <div id="content-main">



<form enctype="multipart/form-data" action="" method="post" id="rasterstore_form" novalidate><input type='hidden' name='csrfmiddlewaretoken' value='Uw890zDbWDjeog7JmWJoP8Ck54aniI6vYLsojB5vJ68iv9hHrAUH1YXBz8eadeLP' />
<div>




    <p class="errornote">
    Please correct the errors below.
    </p>
    




  <fieldset class="module aligned ">
    
    
    
        <div class="form-row field-organisation">
            
            
                <div>
                    
                    
                        <label for="id_organisation">Organisation:</label>
                        
                            <input type="text" name="organisation" id="id_organisation" class="vForeignKeyRawIdAdminField" />
<a href="/admin/lizard_auth_client/organisation/?_to_field=id" class="related-lookup" id="lookup_id_organisation" title="Lookup"></a>
                        
                    
                    
                </div>
            
        </div>
    
        <div class="form-row errors field-access_modifier">
            <ul class="errorlist"><li>This field is required.</li></ul>
            
                <div>
                    
                    
                        <label class="required" for="id_access_modifier">Access modifier:</label>
                        
                            <select name="access_modifier" id="id_access_modifier">
  <option value="0">Public</option>

  <option value="100">Common</option>

  <option value="200">Private</option>

  <option value="300">Hidden</option>

  <option value="9999">Deleted</option>

</select>
                        
                    
                    
                </div>
            
        </div>
    
        <div class="form-row field-rescalable">
            
            
                <div class="checkbox-row">
                    
                    
                        <input type="checkbox" name="rescalable" id="id_rescalable" /><label class="vCheckboxLabel" for="id_rescalable">Rescalable</label>
                    
                    
                        <div class="help">Layer color scale can be rescaled by double clicking the raster store in the data menu.</div>
                    
                </div>
            
        </div>
    
        <div class="form-row field-slug">
            
            
                <div>
                    
                    
                        <label for="id_slug">Slug:</label>
                        
                            <input type="text" name="slug" id="id_slug" class="vTextField" maxlength="64" />
                        
                    
                    
                        <div class="help">Slug of layer, used within the application only. Use lower-case English.</div>
                    
                </div>
            
        </div>
    
        <div class="form-row errors field-name">
            <ul class="errorlist"><li>This field is required.</li></ul>
            
                <div>
                    
                    
                        <label class="required" for="id_name">Name:</label>
                        
                            <input type="text" name="name" id="id_name" required class="vTextField" maxlength="256" />
                        
                    
                    
                        <div class="help">Name of raster store.</div>
                    
                </div>
            
        </div>
    
        <div class="form-row field-description">
            
            
                <div>
                    
                    
                        <label for="id_description">Description:</label>
                        
                            <textarea name="description" id="id_description" rows="10" cols="40" class="vLargeTextField">
</textarea>
                        
                    
                    
                        <div class="help">Optional description</div>
                    
                </div>
            
        </div>
    
        <div class="form-row errors field-store_path">
            <ul class="errorlist"><li>This field is required.</li></ul>
            
                <div>
                    
                    
                        <label class="required" for="id_store_path">Store path:</label>
                        
                            <input type="text" name="store_path" id="id_store_path" required class="vTextField" maxlength="256" />
                        
                    
                    
                        <div class="help">Relative path of raster store. Should be unique within organisation. Multiple, comma-separated paths allowed.</div>
                    
                </div>
            
        </div>
    
        <div class="form-row field-origin">
            
            
                <div>
                    
                    
                        <label for="id_origin_0">Origin:</label>
                        
                            <p class="datetime">
  Date: <input type="text" name="origin_0" id="id_origin_0" class="vDateField" size="10" />

<br />
  Time: <input type="text" name="origin_1" id="id_origin_1" class="vTimeField" size="8" />


</p>
                        
                    
                    
                        <div class="help">Reference date. What you see and type here is in Europe/Amsterdam.<br><em>NB: ignored once a store has been created.</em></div>
                    
                </div>
            
        </div>
    
        <div class="form-row field-interval">
            
            
                <div>
                    
                    
                        <label for="id_interval">Interval:</label>
                        
                            <input type="text" name="interval" id="id_interval" />
                        
                    
                    
                        <div class="help">The interval between consecutive entries on the storage's timescale.<br><em>NB: ignored once a store has been created.</em></div>
                    
                </div>
            
        </div>
    
        <div class="form-row field-optimizer">
            
            
                <div class="checkbox-row">
                    
                    
                        <input type="checkbox" name="optimizer" id="id_optimizer" /><label class="vCheckboxLabel" for="id_optimizer">Optimizer</label>
                    
                    
                        <div class="help">Storage consists of a 2-store group with a fast load store and a temporally optimized main store. <br><em>NB: ignored once a store has been created.</em></div>
                    
                </div>
            
        </div>
    
        <div class="form-row field-temporal">
            
            
                <div class="checkbox-row">
                    
                    
                        <input type="checkbox" name="temporal" id="id_temporal" /><label class="vCheckboxLabel" for="id_temporal">Temporal</label>
                    
                    
                        <div class="help">Specifies whether this raster store has a time component. In other words, does the data change over time?</div>
                    
                </div>
            
        </div>
    
        <div class="form-row errors field-frequency">
            <ul class="errorlist"><li>This field is required.</li></ul>
            
                <div>
                    
                    
                        <label class="required" for="id_frequency">Frequency:</label>
                        
                            <input type="number" name="frequency" id="id_frequency" max="9223372036854775807" required class="vBigIntegerField" min="-9223372036854775808" />
                        
                    
                    
                        <div class="help">Frequency for a raster store that is animatable.</div>
                    
                </div>
            
        </div>
    
        <div class="form-row errors field-aggregation_type">
            <ul class="errorlist"><li>This field is required.</li></ul>
            
                <div>
                    
                    
                        <label class="required" for="id_aggregation_type">Aggregation type:</label>
                        
                            <select name="aggregation_type" id="id_aggregation_type">
  <option value="0">none</option>

  <option value="1">counts</option>

  <option value="2">curve</option>

  <option value="3">histogram</option>

  <option value="4">sum</option>

  <option value="5">average</option>

</select>
                        
                    
                    
                        <div class="help">How to aggregate the data in this layer when in 'area' mode. Only for 'Store'.<br/>- 'Counts' means percentage per category<br/>- 'Curve' means percentile curve<br/>- 'Histogram' means frequency per data band<br/>- 'Sum' means sum<br/></div>
                    
                </div>
            
        </div>
    
        <div class="form-row field-options">
            
            
                <div>
                    
                    
                        <label for="id_options">Options:</label>
                        
                            <textarea name="options" id="id_options" rows="10" cols="40" class="vLargeTextField">
</textarea>
                        
                    
                    
                        <div class="help">Options to be used in WMS requests. Use '{}' if not applicable.</div>
                    
                </div>
            
        </div>
    
        <div class="form-row field-supplier">
            
            
                <div>
                    
                    
                        <label for="id_supplier">Supplier:</label>
                        
                            <div class="related-widget-wrapper">
    <select name="supplier" id="id_supplier">
  <option value="" selected>---------</option>

  <option value="21">admin</option>

  <option value="10">arjan.verkerk</option>

  <option value="4">carsten.byrman</option>

  <option value="3">dirk.weeteling</option>

  <option value="19">emma.vandobben</option>

  <option value="5">gijs.nijholt</option>

  <option value="14">jackie.leng</option>

  <option value="15">jelle.degen</option>

  <option value="13">lars.claussen</option>

  <option value="7">lex.vandolderen</option>

  <option value="8">madeleine.vanwinkel</option>

  <option value="12">martijn.siemerink</option>

  <option value="11">nicolette.volp</option>

  <option value="16">reinout.vanrees</option>

  <option value="6">remco.gerlich</option>

  <option value="17">renier.kramer</option>

  <option value="9">richard.boon</option>

  <option value="2">roel.vandenberg</option>

  <option value="20">tom.deboer</option>

  <option value="1">vagrant</option>

</select>
    
        <a class="related-widget-wrapper-link change-related" id="change_id_supplier"
            data-href-template="/admin/auth/user/__fk__/change/?_to_field=id&amp;_popup=1"
            title="Change selected user"><img src="/static/admin/img/icon-changelink.svg" alt="Change"/></a><a class="related-widget-wrapper-link add-related" id="add_id_supplier"
            href="/admin/auth/user/add/?_to_field=id&amp;_popup=1"
            title="Add another user"><img src="/static/admin/img/icon-addlink.svg" alt="Add"/></a>
    
</div>
                        
                    
                    
                        <div class="help">Supplier of the data.</div>
                    
                </div>
            
        </div>
    
        <div class="form-row field-supplier_code">
            
            
                <div>
                    
                    
                        <label for="id_supplier_code">Supplier code:</label>
                        
                            <input type="text" name="supplier_code" id="id_supplier_code" class="vTextField" maxlength="256" />
                        
                    
                    
                        <div class="help">ID used by the supplier of the data.</div>
                    
                </div>
            
        </div>
    
        <div class="form-row field-last_modified_by">
            
            
                <div>
                    
                    
                        <label for="id_last_modified_by">Last modified by user:</label>
                        
                            <input type="text" name="last_modified_by" id="id_last_modified_by" class="vTextField" maxlength="64" />
                        
                    
                    
                </div>
            
        </div>
    
        <div class="form-row field-observation_type">
            
            
                <div>
                    
                    
                        <label for="id_observation_type">Observation type:</label>
                        
                            <input type="text" name="observation_type" id="id_observation_type" class="vForeignKeyRawIdAdminField" />
<a href="/admin/hydra_core/parameterreferencedunit/?_to_field=id" class="related-lookup" id="lookup_id_observation_type" title="Lookup"></a>
                        
                    
                    
                </div>
            
        </div>
    
        <div class="form-row field-shared_with">
            
            
                <div>
                    
                    
                        <label for="id_shared_with">Shared with:</label>
                        
                            <div class="related-widget-wrapper">
    <select name="shared_with" multiple="multiple" id="id_shared_with">
  <option value="1">Nelen &amp; Schuurmans</option>

  <option value="2">Purmerend</option>

  <option value="3">HHNK</option>

  <option value="4">WSHD</option>

  <option value="5">Winschoten</option>

  <option value="6">Schiedam</option>

  <option value="7">Apeldoorn</option>

  <option value="8">Westland</option>

  <option value="9">Midden-Delfland</option>

  <option value="10">Maassluis</option>

  <option value="11">Vlaardingen</option>

  <option value="12">Delfland</option>

  <option value="14">Korendijk</option>

  <option value="15">Oud-Beijerland</option>

  <option value="16">Strijen</option>

  <option value="17">Cromstrijen</option>

  <option value="18">Binnenmaas</option>

  <option value="19">Lelystad</option>

  <option value="20">Utrecht</option>

  <option value="21">jenkins-dummy</option>

  <option value="22">WPM</option>

  <option value="23">Almere</option>

  <option value="25">OAS de Groote Lucht</option>

  <option value="26">Amsterdam</option>

  <option value="27">Den Haag</option>

  <option value="28">Samenwerking regio Flevoland</option>

  <option value="29">Beemster</option>

  <option value="30">Edam Volendam</option>

  <option value="31">Landsmeer</option>

  <option value="32">Zaanstad</option>

  <option value="33">Hettinger, Collier and Greenfelder</option>

  <option value="34">Towne-Gleason</option>

  <option value="35">Sawayn-Stokes</option>

  <option value="36">Hand, Dicki and Mayert</option>

  <option value="37">Koss-Reichert</option>

  <option value="38">Schmeler-Wilderman</option>

  <option value="39">Koch and Sons</option>

  <option value="40">Balistreri-Hammes</option>

  <option value="41">Von-Langosh</option>

  <option value="42">Dickinson-Schmitt</option>

  <option value="43">Yost PLC</option>

  <option value="44">Pfannerstill Group</option>

  <option value="45">Towne-Olson</option>

  <option value="46">Jakubowski Ltd</option>

  <option value="47">Bruen-Hegmann</option>

  <option value="48">Schaefer-Schulist</option>

  <option value="49">Wiegand and Sons</option>

  <option value="50">Parisian, Swift and Wiza</option>

  <option value="51">Hoppe Group</option>

  <option value="52">Morar-Nienow</option>

  <option value="53">Schultz Inc</option>

  <option value="54">Stanton-Pollich</option>

  <option value="55">Zboncak, Wuckert and Jakubowski</option>

  <option value="56">Davis-Goyette</option>

  <option value="57">Erdman Inc</option>

  <option value="58">Rolfson, Rosenbaum and O&#39;Connell</option>

  <option value="59">Kohler-Lynch</option>

  <option value="60">Macejkovic PLC</option>

  <option value="61">Conroy, Konopelski and Kiehn</option>

  <option value="62">Schamberger, Ondricka and Weimann</option>

  <option value="63">Johnson, Schimmel and Kub</option>

  <option value="64">Braun-Haley</option>

  <option value="65">Grimes, Swift and Marks</option>

  <option value="66">Schultz-Moore</option>

  <option value="67">Langosh-Lowe</option>

  <option value="68">Cassin LLC</option>

  <option value="69">Marvin, Stracke and Kreiger</option>

  <option value="70">Collins-Daniel</option>

  <option value="71">Hoeger Inc</option>

  <option value="72">Muller, Fahey and Hodkiewicz</option>

  <option value="73">Stokes Inc</option>

  <option value="74">Stracke, Larkin and Boyle</option>

  <option value="75">Pfeffer, Cartwright and Gaylord</option>

  <option value="76">Trantow LLC</option>

  <option value="77">Legros LLC</option>

  <option value="78">Yundt-Hintz</option>

  <option value="79">Borer, Effertz and Schowalter</option>

  <option value="80">Oberbrunner, Moore and Windler</option>

  <option value="81">Windler LLC</option>

  <option value="82">Legros, Zboncak and Bradtke</option>

  <option value="83">Lebsack-Hermann</option>

  <option value="84">Hagenes-Reilly</option>

  <option value="85">Mann, Nolan and Champlin</option>

  <option value="86">Bergstrom Inc</option>

  <option value="87">Mosciski, Mraz and Kassulke</option>

  <option value="88">Purdy Inc</option>

  <option value="89">Johnson, Cartwright and Keeling</option>

  <option value="90">Steuber, Lueilwitz and Doyle</option>

  <option value="91">Doyle-McDermott</option>

  <option value="92">Schaden-Ullrich</option>

  <option value="93">Walsh, Corwin and Murphy</option>

  <option value="94">Brown, Kerluke and Treutel</option>

  <option value="95">Bernhard LLC</option>

  <option value="96">Schoen-Veum</option>

  <option value="97">O&#39;Connell, Cummerata and Blanda</option>

  <option value="98">Rodriguez-Christiansen</option>

  <option value="99">McLaughlin, Hettinger and McLaughlin</option>

  <option value="100">Romaguera Inc</option>

  <option value="101">Zieme Ltd</option>

  <option value="102">Predovic LLC</option>

  <option value="103">Macejkovic-Hahn</option>

  <option value="104">Harris-Schuppe</option>

  <option value="105">Berge-Maggio</option>

  <option value="106">Harber and Sons</option>

  <option value="107">Quigley, Kuphal and Greenholt</option>

  <option value="108">Kuhlman PLC</option>

  <option value="109">Dare LLC</option>

  <option value="110">Ankunding-Kautzer</option>

  <option value="111">Hills-Wisozk</option>

  <option value="112">Carroll-Stark</option>

  <option value="113">Price, O&#39;Hara and Schoen</option>

  <option value="114">Wilkinson Ltd</option>

  <option value="115">Dietrich-Price</option>

  <option value="116">Walsh-Kautzer</option>

  <option value="117">Goodwin, Daniel and Wolf</option>

  <option value="118">Hyatt LLC</option>

  <option value="119">Wehner-Keebler</option>

  <option value="120">Murazik PLC</option>

  <option value="121">Gibson, Tremblay and Mueller</option>

  <option value="122">Mijnsheerenland</option>

  <option value="123">Hollands Kroon</option>

  <option value="124">Kamer van Koophandel</option>

  <option value="125">Western Cape University (South Africa)</option>

  <option value="126">Vlaams Ministerie van Mobiliteit en Openbare Werken</option>

  <option value="127">VinaNed</option>

  <option value="128">test_organisation_debugging_igrac</option>

  <option value="129">Goudswaard</option>

  <option value="130">Norwegian Water Resources and Energy Directorate NVE (Norway)</option>

  <option value="131">Enschede</option>

  <option value="132">Universiteit Twente</option>

  <option value="133">Roerdalen</option>

  <option value="134">Sittard-Geleen</option>

  <option value="135">Wetterskip Fryslân</option>

  <option value="136">Castricum</option>

  <option value="137">ACI</option>

  <option value="138">Landustrie</option>

  <option value="139">Bergen (L)</option>

  <option value="140">Ministry of Natural Resources, Department of Water Affairs (Lesotho)</option>

  <option value="141">BZ Innovatie</option>

  <option value="142">HHNK_HWBP</option>

  <option value="143">Alphen aan den Rijn</option>

  <option value="144">Hardenberg</option>

  <option value="145">Limmel-Heugem</option>

  <option value="146">Stichting IJkdijk</option>

  <option value="147">Brabant Water</option>

  <option value="148">www.target-holding.nl </option>

  <option value="149">Rijswijk</option>

  <option value="150">Aa en Hunze</option>

  <option value="151">Ecoflight</option>

  <option value="152">VanderSat</option>

  <option value="153">Soest</option>

  <option value="154">Peel en Maas</option>

  <option value="155">IntellinQ</option>

  <option value="156">Schiphol</option>

  <option value="157">De Stichtse Rijnlanden</option>

  <option value="158">TNO Geologische Dienst (Netherlands)</option>

  <option value="159">Venray</option>

  <option value="160">Velsen</option>

  <option value="161">ARCADIS NL</option>

  <option value="162">Water Resources and Utilization Department (Myanmar)</option>

  <option value="163">Groningen</option>

  <option value="164">TEST</option>

  <option value="165">Frauenhofer IAIS</option>

  <option value="166">Floodtags</option>

  <option value="167">VisAdvies BV</option>

  <option value="168">Weert</option>

  <option value="169">Middelsluis</option>

  <option value="170">Nijmegen</option>

  <option value="171">International groundwater resources assessment centre (IGRAC)</option>

  <option value="172">Lizard beheer</option>

  <option value="173">KWR</option>

  <option value="174">Delftsyst Intermark Team</option>

  <option value="175">Ministry of Water Resources (Sierra Leone)</option>

  <option value="176">WSRL</option>

  <option value="177">WaterLand Experts</option>

  <option value="178">TU Delft</option>

  <option value="179">Achmea</option>

  <option value="180">Vaals</option>

  <option value="181">Noordoostpolder</option>

  <option value="182">Amersfoort</option>

  <option value="183">Dordrecht</option>

  <option value="184">Klaaswaal</option>

  <option value="185">Satelligence</option>

  <option value="186">Target Holding</option>

  <option value="187">NEO BV</option>

  <option value="13">Wormerland</option>

  <option value="188">Vito</option>

  <option value="189">ddsc</option>

  <option value="190">Hansje Brinker</option>

  <option value="191">Den Helder</option>

  <option value="192">Wareco</option>

  <option value="193">Hessisches Landesamt für Umwelt und Geologie (Germany)</option>

  <option value="194">STOWA</option>

  <option value="195">Autoridad Nacional del Agua (Peru)</option>

  <option value="196">Dienst Landelijk Gebied</option>

  <option value="197">Department of Water Resources (Somalia)</option>

  <option value="198">Ministerie van Veiligheid en Justitie</option>

  <option value="24">Leidschendam-Voorburg</option>

  <option value="199">Roermond</option>

  <option value="200">HHNK_events</option>

  <option value="201">Beverwijk</option>

  <option value="202">Waterschap Vechtstromen</option>

  <option value="203">GIZ</option>

  <option value="204">Almelo</option>

  <option value="205">Heiloo</option>

  <option value="206">RHDHV</option>

  <option value="207">Hydroinformatics</option>

  <option value="208">Zeewolde</option>

  <option value="209">Waterschap Vallei en Veluwe</option>

  <option value="210">Stede Broec</option>

  <option value="211">http://www.inventec.nl/</option>

  <option value="212">Heinenoord</option>

  <option value="213">SarVision</option>

  <option value="214">Brunssum</option>

  <option value="215">NZV</option>

  <option value="216">Vitens NV</option>

  <option value="217">Naamloze organisatie</option>

  <option value="218">Fugro</option>

  <option value="219">Realtech ICT BV</option>

  <option value="220">Inpijn-Blokpoel</option>

  <option value="221">ernst</option>

  <option value="222">KNMI</option>

  <option value="223">ICT Automatisering</option>

  <option value="224">Opmeer</option>

  <option value="225">Sistema Nacional de Informação de Recursos Hídricos SNIRH (Portugal)</option>

  <option value="226">Breda</option>

  <option value="227">Swiss Federal Office for the Environment FOEN (Switzerland)</option>

  <option value="228">Ministry of Natural Resources and Environment (Vietnam)</option>

  <option value="229">HHSK</option>

  <option value="230">Rhenen</option>

  <option value="231">U.S. Geological Survey (United States)</option>

  <option value="232">Waternet</option>

  <option value="233">Tijhuis Ingenieurs</option>

  <option value="234">Langedijk</option>

  <option value="235">TNO</option>

  <option value="236">ZLTO</option>

  <option value="237">HydroLogic</option>

  <option value="238">Van der Linden pomptechniek bv</option>

  <option value="239">Antea Group</option>

  <option value="240">Zuid-Beijerland</option>

  <option value="241">Strukton</option>

  <option value="242">Het Waterschapshuis</option>

  <option value="243">Rijkswaterstaat</option>

  <option value="244">http://www.hhdelfland.nl/</option>

  <option value="245">&#39;s-Gravendeel</option>

  <option value="246">Department of Groundwater Resources (Thailand)</option>

  <option value="247">Heerhugowaard</option>

  <option value="248">http://www.rijnland.net/</option>

  <option value="249">Databank Ondergrond Vlaanderen (Belgium)</option>

  <option value="250">Provincie Utrecht</option>

  <option value="251">Grontmij Denmark</option>

  <option value="252">Bergen NH</option>

  <option value="253">Twenterand</option>

  <option value="254">Piershil</option>

  <option value="255">Tuinders DIG</option>

  <option value="256">Dronten</option>

  <option value="257">Stelling Hydraulics</option>

  <option value="258">Maasgouw</option>

  <option value="259">Medemblik</option>

  <option value="260">G4AW Bangladesh</option>

  <option value="261">Eijsden-Margraten</option>

  <option value="262">Waterland</option>

  <option value="263">Koggenland</option>

  <option value="264">Rijkswaterstaat_matroos</option>

  <option value="265">Siemens</option>

  <option value="266">eLEAF</option>

  <option value="267">Drechterland</option>

  <option value="268">Rivierenland</option>

  <option value="269">Hoogheemraadschap van Rijnland</option>

  <option value="270">MOW Vlaanderen</option>

  <option value="271">Land van Cuijk</option>

  <option value="272">BsGW</option>

  <option value="273">Waterschap Noorderzijlvest</option>

  <option value="274">IJsselstein</option>

  <option value="275">Alkmaar</option>

  <option value="276">Schagen</option>

  <option value="277">PWN</option>

  <option value="278">Schinnen</option>

  <option value="279">IBM</option>

  <option value="280">HDSR</option>

  <option value="281">Echt-Susteren</option>

  <option value="282">Mekong Water Technology Innovations Institute</option>

  <option value="283">G4AW Vietnam</option>

  <option value="284">Wageningen UR</option>

  <option value="285">Enkhuizen</option>

  <option value="286">PUM Netherlands Senior Experts</option>

  <option value="287">Mook en Middelaar</option>

  <option value="288">International Water Management Institute (Pakistan)</option>

  <option value="289">Kuipers Electronic Engineering bv</option>

  <option value="290">Hoorn</option>

  <option value="291">Maastricht</option>

  <option value="292">Netherlands Space Office</option>

  <option value="293">Nieuw-Beijerland</option>

  <option value="294">Noorderzijlvest</option>

  <option value="295">Geological Survey Canada (Canada)</option>

  <option value="296">NASA</option>

  <option value="297">Twents Waternetwerk</option>

  <option value="298">Stiching RIONED</option>

  <option value="299">Simpelveld</option>

  <option value="300">Grontmij</option>

  <option value="301">Durable Blue</option>

  <option value="302">Hoogheemraadschap van Delfland</option>

  <option value="303">Instituto Nacional de Meteorología e Hidrología (Ecuador)</option>

  <option value="304">Nederweert</option>

  <option value="305">Wateropleidingen</option>

  <option value="306">Minerals and Geoscience Department (Malaysia)</option>

  <option value="307">Ministry of Water &amp; Environment (Uganda)</option>

  <option value="308">Ermelo</option>

  <option value="309">Wetlands International</option>

  <option value="310">Vietnam World Bank</option>

  <option value="311">RWS</option>

  <option value="312">French Geological Survey BRGM (France)</option>

  <option value="313">Mourik</option>

  <option value="314">Waterschap de Dommel</option>

  <option value="315">Oostzaan</option>

  <option value="316">Waterschap Reest en Wieden</option>

  <option value="317">Alert Solutions</option>

  <option value="318">Oasen</option>

  <option value="319">Zeevang</option>

  <option value="320">Heemskerk</option>

  <option value="321">Steenbergen</option>

  <option value="322">Valkenburg</option>

  <option value="323">Ministry of Agriculture, Water and Forestry, Department of Water Affairs and Forestry, Division Water Environment (Namibia)</option>

  <option value="324">huygenhoek_taxaties</option>

  <option value="325">Deltares</option>

  <option value="326">MicroX</option>

  <option value="327">Hoogheemraadschap Hollands Noorderkwartier</option>

  <option value="328">Geological Survey of Sweden (Sweden)</option>

  <option value="329">Visser &amp; Smit Hanab</option>

  <option value="330">Leudal</option>

  <option value="331">Evides</option>

  <option value="332">StabiAlert</option>

  <option value="333">NRC</option>

  <option value="334">Instituto de Hidrología, Meteorología y Estudios Ambientales (Colombia))</option>

  <option value="335">InTech</option>

  <option value="336">Waterschap Hunze en Aa&#39;s</option>

  <option value="337">ARA-SUL, Resources Management (Mozambique)</option>

  <option value="338">Waterschap Roer en Overmaas</option>

  <option value="339">AGT International</option>

  <option value="340">AMO-meteo</option>

  <option value="341">Ambient</option>

  <option value="342">Horst aan de Maas</option>

  <option value="343">NOAA</option>

  <option value="344">BZ Innovatiemanagement</option>

  <option value="345">Overig</option>

  <option value="346">Miramap</option>

  <option value="347">Infoplaza B.V.</option>

  <option value="348">Indonesia Diaspora Network</option>

  <option value="349">Waterschap Groot Salland</option>

  <option value="350">Ministry of Energy (Iran)</option>

  <option value="351">De Waal BSP</option>

  <option value="352">Rotterdam</option>

  <option value="353">Rijksdienst voor Ondernemend Nederland</option>

  <option value="354">Eindhoven</option>

  <option value="355">Urk</option>

  <option value="356">Oldambt</option>

  <option value="357">Binh Minh Water &amp; Environment Company</option>

  <option value="358">Meerssen</option>

  <option value="359">Leendert de Boerspolder</option>

  <option value="360">Buren</option>

  <option value="361">IMD BV</option>

  <option value="362">Venlo</option>

  <option value="363">Stein</option>

  <option value="364">HAII</option>

  <option value="365">Waterschapshuis</option>

  <option value="366">Waterschap Aa en Maas</option>

  <option value="367">Numansdorp</option>

  <option value="368">Readaar</option>

  <option value="369">Stichting PostAcademisch Onderwijs</option>

  <option value="370">Ministry of Water, Groundwater Unit (Tanzania)</option>

  <option value="371">TenCate</option>

  <option value="372">Bridgis Geoservices</option>

  <option value="373">Loenen</option>

  <option value="374">Viscomm</option>

  <option value="375">Zimbabwe National Water Authority (ZINWA) (Zimbabwe)</option>

  <option value="376">Witteveen+Bos</option>

  <option value="377">Breukelen</option>

  <option value="378">Texel</option>

  <option value="379">Gulpen-Wittem</option>

  <option value="380">Westmaas</option>

  <option value="381">Waterschap Drents Overijsselse Delta</option>

  <option value="382">Scheldestromen</option>

  <option value="383">Nelen &amp; Schuurmans echt alleen maar werknemers</option>

  <option value="384">Voerendaal</option>

  <option value="385">Bareau</option>

  <option value="386">Agro Energy</option>

  <option value="387">HKV</option>

  <option value="388">Uitgeest</option>

  <option value="389">Provincie Zuid-Holland</option>

  <option value="390">Zuiderzeeland</option>

  <option value="391">Wassenaar</option>

  <option value="392">Waterschapsbedrijf Limburg</option>

  <option value="393">Schlumberger Water Services</option>

  <option value="394">Vallei en Eem</option>

  <option value="395">Agência Nacional de Águas (Brasil)</option>

  <option value="396">Colorado School of Mines</option>

</select>
    
        <a class="related-widget-wrapper-link add-related" id="add_id_shared_with"
            href="/admin/lizard_auth_client/organisation/add/?_to_field=id&amp;_popup=1"
            title="Add another organisation"><img src="/static/admin/img/icon-addlink.svg" alt="Add"/></a>
    
</div>
                        
                    
                    
                        <div class="help">Hold down "Control", or "Command" on a Mac, to select more than one.</div>
                    
                </div>
            
        </div>
    
        <div class="form-row field-last_modified">
            
            
                <div>
                    
                    
                        <label>Last modified:</label>
                        
                            <div class="readonly">-</div>
                        
                    
                    
                        <div class="help">Displayed in Europe/Amsterdam.</div>
                    
                </div>
            
        </div>
    
        <div class="form-row field-uuid">
            
            
                <div>
                    
                    
                        <label>UUID:</label>
                        
                            <div class="readonly">5f1b1f35-4369-42c2-98b5-7997e5ac96de</div>
                        
                    
                    
                        <div class="help">Universally unique identifier.</div>
                    
                </div>
            
        </div>
    
        <div class="form-row field-bbox">
            
            
                <div>
                    
                    
                        <label>Bbox:</label>
                        
                            <div class="readonly">None</div>
                        
                    
                    
                </div>
            
        </div>
    
        <div class="form-row field-geometry">
            
            
                <div>
                    
                    
                        <label>Geometry:</label>
                        
                            <div class="readonly">-</div>
                        
                    
                    
                </div>
            
        </div>
    
        <div class="form-row field-equidistant">
            
            
                <div>
                    
                    
                        <label>Equidistant:</label>
                        
                            <div class="readonly">-</div>
                        
                    
                    
                </div>
            
        </div>
    
        <div class="form-row field-first_value_timestamp">
            
            
                <div>
                    
                    
                        <label>First value timestamp:</label>
                        
                            <div class="readonly">-</div>
                        
                    
                    
                        <div class="help">Timestamp of first layer in Europe/Amsterdam.</div>
                    
                </div>
            
        </div>
    
        <div class="form-row field-last_value_timestamp">
            
            
                <div>
                    
                    
                        <label>Last value timestamp:</label>
                        
                            <div class="readonly">-</div>
                        
                    
                    
                        <div class="help">Timestamp of last layer in Europe/Amsterdam.</div>
                    
                </div>
            
        </div>
    
        <div class="form-row field-spatial_bounds">
            
            
                <div>
                    
                    
                        <label>Spatial bounds:</label>
                        
                            <div class="readonly">None</div>
                        
                    
                    
                </div>
            
        </div>
    
</fieldset>













<div class="submit-row">
<input type="submit" value="Save" class="default" name="_save" />


<input type="submit" value="Save and add another" name="_addanother" />
<input type="submit" value="Save and continue editing" name="_continue" />
</div>



    <script type="text/javascript"
            id="django-admin-form-add-constants"
            src="/static/admin/js/change_form.js"
            
                data-model-name="rasterstore"
            >
    </script>




<script type="text/javascript"
        id="django-admin-prepopulated-fields-constants"
        src="/static/admin/js/prepopulate_init.js"
        data-prepopulated-fields="[]">
</script>


</div>
</form></div>

        
        <br class="clear" />
    </div>
    <!-- END Content -->

    <div id="footer"></div>
</div>
<!-- END Container -->

</body>
</html>
debugger eval code:83:9


//*/
