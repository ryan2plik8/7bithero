<!DOCTYPE HTML>
<html>
  <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" href="style.css"/>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
    <script type="text/javascript" src="js/cufon.js"></script>
    <script type="text/javascript" src="js/Geared_Slab_400-Geared_Slab_700.font.js"></script>
    <script type="text/javascript">
      Cufon.replace('div.nav ul li a', { 
        color: '-linear-gradient(#dfeef9, #9ab9d1)',
        textShadow: '1px 0px #0f293e'
      });
      Cufon.replace('h1');
    </script>
    <link href='http://fonts.googleapis.com/css?family=Josefin+Slab:700' rel='stylesheet' type='text/css'>

    <script type="text/javascript">
      $(window).load(function(){
        // Set the empty variable
        var width = 0;

        //Get the full container width to house all the slides
        $('div.slideshow').find('div.slide').each(function(){
          width += $(this).width() + 2;
        });

          //Set the left margin based on widow and slide size, also perform this
          //on window resize
          var left = $(window).width() - $('div.slide').outerWidth();
          var leftmargin = left / 2;
          $('div.slideshow').css('width', width).css('left', leftmargin);
        $(window).resize(function(){
          var left = $(window).width() - $('div.slide').outerWidth();
          var leftmargin = left / 2;
          $('div.slideshow').css('width', width).css('left', leftmargin);
        });

        //Based on active slide get the next 2 slides, with the next slide
        //put it to the right of the current slide, with the last put it
        //at the start

        //Clear the last div class

        //Lets start by getting the index of active and add 2
        var index = $('div.active').index() + 2;

        //Now lets get the result
        $('div.slide').eq(index).addClass('last');        

          //On click change the active slide
          $('div.slideshow').click(function(){
            $(this).find('div.last').removeClass('last');

            $('div.active').next('div.slide').addClass('active')
              .siblings('div.slide')
              .removeClass('active');

              var index = $('div.active').index() + 2;
              console.log(index);
          });
      });
    </script> 

  </head>
  <body>
  	<div class="header">
  		<div class="headerContainer">
  			<div class="logo">
  				<img src="images/logo.png" alt="">
  			</div> <!-- end logo-->
  			<div class="nav">
  				<ul>
            <li><a href="#">Shop</a></li>
            <li><a href="#">Discography</a></li>
            <li><a href="#">Media</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Tour</a></li>
          </ul>
  			</div><!-- end nav -->
  			<div class="signup">
  				<form action="#">
            <input type="text" name="signup" value="Signup">
            <input type="submit" value=""/> 
          </form>
  			</div><!-- end signup -->
  		</div><!-- headerContainer -->
  	</div><!-- end header -->

    <div class="slideshow">
        <div class="slide active"><img src="images/slide.jpg" alt=""></div>
        <div class="slide"><img src="images/slide.jpg" alt=""></div>
        <div class="slide"><img src="images/slide.jpg" alt=""></div>
        <div class="slide"><img src="images/slide.jpg" alt=""></div>
    </div><!-- end slideshow -->


    <?php
function fetchUrl($url){
     $ch = curl_init();
     curl_setopt($ch, CURLOPT_URL, $url);
     curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
     curl_setopt($ch, CURLOPT_TIMEOUT, 20);
 
     $retData = curl_exec($ch);
     curl_close($ch); 
 
     return $retData;
}

$profile_id = "7bitHero";   

//App Info, needed for Auth
$app_id = "432354600163613";
$app_secret = "50f1d345c1e60d0ef0cc862f5bfbe8ef";
 
//retrieve a new Auth token
$authToken = fetchUrl("https://graph.facebook.com/oauth/access_token?type=client_cred&client_id={$app_id}&client_secret={$app_secret}");
// fetch profile feed with the Auth token appended
$data = fetchUrl("https://graph.facebook.com/{$profile_id}/feed?{$authToken}");

$arr = json_decode($data);
$array = $arr->data;
$comments = $arr->data->comments; 
?>

    <div class="content">
      <div class="primary">
        <?php $i = 0; ?>
        <?php foreach($array as $item): ?>
          <div class="fb-entry">
            <div class="padding">
            <?php if($item->object_id): ?>
              <img class="story-image" src="<?php echo 'https://graph.facebook.com/'.$item->object_id.'/picture?type=normal'; ?>"/>
            <?php endif; ?>
              <p><?php echo nl2br($item->message); ?></p>
            <?php if($item->story): ?>
              <p><?php echo $item->story; ?></p>
            <?php endif; ?>
          </div><!-- end padding -->
          <div class="fb-entry-footer">
            <div class="padding">
              <div class="left">
                <?php $linkid = str_replace('_', '/posts/', $item->id); ?>
                <p><a href="https://facebook.com/<?php echo $linkid; ?>">View on Facebook</a></p>
              </div><!-- end left -->
              <div class="right"><p><?php echo date('M d, Y', strtotime($item->created_time)); ?></p></div><!-- end right -->
              <div style="clear:both;"></div>
              <img src="images/fb.png" alt="">
            </div><!-- end padding -->
          </div><!-- end fb-entry-footer -->
          </div><!-- end fb-entry -->
          <?php foreach($item->comments->data as $comment): ?>
            <div class="comments">
              <img class="profilepic" src="http://graph.facebook.com/<?php echo $comment->from->id; ?>/picture?type=normal" width="60">
              <h1><?php echo $comment->from->name; ?></h1>
              <p><?php echo $comment->message; ?></p>
            </div><!-- end comments -->
          <?php endforeach; ?>
          <?php if(++$i > 3) break; ?>
        <?php endforeach; ?>
      </div>
    </div><!-- end content -->
    
  </body>
  <div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_GB/all.js#xfbml=1&appId=432354600163613";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
</html>