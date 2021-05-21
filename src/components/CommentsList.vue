<template>
  <div class="comments">
    <div class="loader loader-margin" v-if="!post"></div> <!-- .loader -->
    <template v-else>
      <div id="heading">
        <router-link
          :to="{ name: 'commentsList', params: { id: post.id } }"
          class="post-title"
          v-if="isShortUrl(post.url)"
        >
          {{post.title}}
        </router-link>
        <a v-else :href="post.url" target="_blank" rel="noopener" class="title">
          {{post.title}}&nbsp;
        </a>
        <small v-if="post.domain">({{post.domain}})</small>
      </div>
      <div class="comment-info">
        <span v-if="post.points !== null">{{pluralize(post.points, 'point')}}</span>
        <span v-if="post.user"> by <b>{{post.user}}</b></span>
        <span>&nbsp;{{post.time_ago}} |</span>
        <span>&nbsp;{{pluralize(post.comments_count, 'comment')}}</span>
      </div>
      <ul class="list-unstyled">
        <comment v-for="comment in post.comments" :comment="comment" :key="comment.id" />
      </ul>
    </template>
  </div><!-- .comments -->
</template>

<script>
import { pluralize, isShortUrl } from '../utils';
import Comment from './Comment.vue';

export default {
  name: 'comments-list',
  components: {
    Comment,
  },
  data() {
    return {
      id: this.$route.params.id,
      post: null,
    };
  },
  created() {
    this.fetchPost();
  },
  methods: {
    pluralize,
    isShortUrl,
    fetchPost() {
      fetch(`https://node-hnapi.herokuapp.com/item/${this.id}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API response error');
      })
      .then((res) => { this.post = res; })
      .catch(e => console.error(e.message));
    },
  },
};
</script>

<style>

.comments {
  margin-top: 25px;
  height: calc(100vh - 25px);
  background: #fff;
  padding: 6px 1.5vw;
  display: flex;
  flex-direction: column;
}

.comments >ul>li { --level: 1 }
.comments >ul>li>ul>li { --level: 2 }
.comments >ul>li>ul>li>ul>li { --level: 3 }
.comments >ul>li>ul>li>ul>li>ul>li { --level: 4 }
.comments >ul>li>ul>li>ul>li>ul>li>ul>li { --level: 5 }
.comments >ul>li>ul>li>ul>li>ul>li>ul>li>ul>li { --level: 6 }
.comments >ul>li>ul>li>ul>li>ul>li>ul>li>ul>li>ul>li { --level: 7 }
.comments >ul>li>ul>li>ul>li>ul>li>ul>li>ul>li>ul>li>ul>li { --level: 8 }
.comments >ul>li>ul>li>ul>li>ul>li>ul>li>ul>li>ul>li>ul>li>ul>li { --level: 9 }
.comments >ul>li>ul>li>ul>li>ul>li>ul>li>ul>li>ul>li>ul>li>ul>li>ul>li { --level: 10 }

.comments > ul {
  flex: 1;
  overflow: auto;
  padding-right: 1vw;
}

.title {
  font-size: 1.5em;
  color: #333;
}

.loader-margin {
  margin: calc(50vh - 60px) auto;
}

.list-unstyled {
  list-style: none;
  padding-left: 0;
  margin-block-start: 0;
  margin-block-end: 0;
}

.comment-info {
  padding-bottom: 12px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 5px;
}
</style>
