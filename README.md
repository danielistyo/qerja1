Typer Problem   
    
Kita mencari developer yang mandiri, ketika ada masalah, aktif mencari solusi dengan sendirinya dan mudah mengerti instruksi tanpa terlalu banyak menanyakan untuk memahami instruksi.     
Berikut adalah aplikasi Javascript yang simple.    
Kami tidak akan menjelaskan bagaimana cara kerjanya atau library apa yang dipakai.   
    
Pertanyaan:   
1. Sebutkan library apa saja yang dipakai, website library itu dimana, dan dokumentasi library itu ada dimana.    
2. Aplikasi itu 'laggy'. Kenapa? Bagaimana cara membuat animasi lebih 'smooth'?    
3. Aplikasi itu tidak akan jalan di salah satu 3 browser populer (Chrome, Firefox, Internet Explorer)? Kenapa? Solusinya hanya menghapus satu character di code, character yang mana?    
4. Implementasikan tombol Start, Stop, Pause, dan Resume.   
5. Ketika ukuran window dirubah, susunan huruf yang 'terbentur' batas window menjadi tidak 1 baris. Benarkan.    
6. Implementasikan sistem score.   
7. Implementasikan hukuman berupa pengurangan nilai bila salah ketik.

Jawaban:
<p>1. Ada 5 library :</p>
<ul>
  <li>BackboneJS (http://backbonejs.org/), </li>
  <li>Bootstrap (https://getbootstrap.com/ & https://getbootstrap.com/docs/4.0/getting-started/introduction/), </li>
  <li>UnderscoreJS (http://underscorejs.org/), </li>
  <li>JQuery(https://jquery.com/ & http://api.jquery.com/), </li>
  <li>JQueryUI(http://jqueryui.com/ & http://api.jqueryui.com/)</li>
</ul>
<p>2. Karena fungsi <code>iterate</code> pada model <code>Typer</code> dipanggil dengan interval yang terlalu lama. Sehingga animasi yang tampak akan terlihat <i>Laggy</i>. Untuk membuat animasi lebih <i>smooth</i>, ubah nilai <code>animation_delay</code> menjadi 1. Artinya fungsi <code>iterate</code> akan dipanggil setiap 1 milisecond. Lalu ubah perhitungan property <code>speed</code> pada model <code>Word</code> agar setiap kata yang turun tidak terlalu cepat, seperti ini: </p>

```javascript
speed:(this.random_number_from_interval(this.get('min_speed'),this.get('max_speed')))/10
```
