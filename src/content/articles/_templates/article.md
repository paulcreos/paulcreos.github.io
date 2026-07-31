<%*
const title = await tp.system.prompt("Názov článku");

function slugify(str) {
  return str
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // odstráni diakritiku
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const slug = slugify(title);
await tp.file.rename(slug);
-%>
---
title: <% title %>
description: 
date: <% tp.date.now("YYYY-MM-DD") %>
author: 'Paul Creos'
category: technology
# For Works articles, uncomment both lines below:
# cover: images/example.jpg
# coverAlt: A concise description of the artwork shown in the image
draft: true
---
