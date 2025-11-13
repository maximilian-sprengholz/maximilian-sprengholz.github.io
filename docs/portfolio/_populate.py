import sys
import argparse
import os
import re

# initialize each portfolio item as a project with some characteristics from which we build the sidebar and lightbox
class Project():

  def __init__(self, filename, title=None, markdown=None, images=[]):
    self.filename = filename  # the file name, e.g. 'project1.md'
    self.filestub = os.path.splitext(filename)[0]  # the corresponding stub without extension, e.g. 'project1'
    self.title = title  # the title of the project fetched from the h1 of the markdown file, must use '# Headline'
    self.markdown = markdown  # the markdown of the project file
    self.images = images.copy()  # the images to be shown on the project page
    self.thumbnail = None  # thumbnail image for root


def get_markdown(file, replace_tag): 
  # get markdown, parse title
  markdown = []
  skip = 0
  with open(file) as f:
    for line in f:
      if re.match(re.escape(replace_tag), line) != None and skip == 0:
        skip = 1
        markdown.append(line.strip()) # still append this line
      elif re.match(re.escape(replace_tag), line) != None and skip == 1:
        skip = 0
      if skip == 0:
        markdown.append(line.strip())
  return markdown


def get_projects(portfolio):
  """
  Requires a dictionary with:
  - path: a path to the portfolio *.md files
  - projects: an empty list to be populated with Project() items
  """
  # parse markdown files in portfolio dir
  for file in sorted(os.listdir(portfolio["path"])):
    path = os.path.join(portfolio["path"], file)
    if os.path.isfile(path):
      name, ext = os.path.splitext(file)
      # treat all regular markdown files as project files
      if ext == '.md' and name not in ["_sidebar", "README", "_navbar", "_coverpage"]:
        # init project (filename & stub)
        project = Project(file)
        # get markdown
        project.markdown = get_markdown(path, portfolio["replace_tag"])
        # extract title (first headline)
        for line in project.markdown:
          title_search = re.match(r'(^\s*#+\s*)(.*)(<!--.*-->?)$', line)
          if title_search:
            project.title = title_search.group(2).strip()
            break
        # append to portfolio list
        portfolio["projects"].append(project)


def get_images(portfolio):
  """
  Requires a dictionary with:
  - image_path: a path to the portfolio image files
  - projects: a list with Project() items
  """
  # get corresponding image files from image dir (name based, has to be 'filestub...')
  files = os.listdir(portfolio["image_path"])
  for project in portfolio["projects"]:
    for file in files:
      if os.path.isfile(os.path.join(portfolio["image_path"], file)):
        if re.match(re.escape(project.filestub) + r'[^@]*(\..*$)', file):  # exclude hidpi images with '@#x' suffix
          # add portolio root thumbnail if present (then skip for project images)
          if re.match(r'.*thumb.*', file):
            project.thumbnail = portfolio["image_path_rel"] + file
            continue
          project.images.append(portfolio["image_path_rel"] + file) 
    # issue warning if no images found, set default thumbnail from first image if missing
    if len(project.images) == 0:
      if project.thumbnail is None:
        print("No images found with prefix " + project.filestub + " under " + portfolio["image_path"])  
      else:
        print("Only thumbnail found with prefix " + project.filestub + " under " + portfolio["image_path"])
    else:
      project.images.sort()
      if project.thumbnail is None:
        project.thumbnail = project.images[0]
          

def populate_projects(portfolio):
  # open project .md files and add image links which will form the basis of the lightbox
  for project in portfolio["projects"]:
    replaced = 0
    with open(os.path.join(portfolio["path"], project.filename), 'w') as f:
      for line in project.markdown:
        if re.match(re.escape(portfolio["replace_tag"]), line) != None and replaced == 0:
          print(line, file=f)
          # add lightbox button
          print('<a class="button" id="lightbox-btn" href="#">All Images</a><br />', file=f)
          # wrap in in div, allow for flex layout
          print('<div class="image-col">', file=f)
          for i, image in enumerate(project.images):
            # build html
            html_img = '<img src="' + portfolio["path_rel"] + image + '" '
            html_img += 'alt="' + project.title + " portfolio image " + str(i) + '" />'
            html_a_start = '<a href="' + portfolio["path_rel"] + image + '" '
            html_a_start += 'class="project-lightbox" '
            html_a_start += 'title="' + project.title + " portfolio image " + str(i) + '">'
            html_a_end = '</a>'
            # first link contains the title image, all others are empty links
            if i == 0:
              print(html_a_start + html_img + html_a_end, file=f)
            else:
              print(html_a_start + html_a_end, file=f)
          print('</div>', file=f)
          replaced = 1
        else:
          print(line, file=f)   


def populate_root(portfolio):
  path = os.path.join(portfolio["path"], "README.md")
  # read markdown
  markdown = get_markdown(path, portfolio["replace_tag"])
  replaced = 0
  with open(path, 'w') as f:
    for line in markdown:
      print(line, file=f)
      if re.match(re.escape(portfolio["replace_tag"]), line) != None and replaced == 0:
        # wrap in in div, allow for flex layout
        print('<div class="portfolio-grid">', file=f)
        for project in portfolio["projects"]:
          if project.thumbnail is not None:  # can only be none if there are no images for this project
            html_img = '<img src="' + portfolio["path_rel"] + project.thumbnail + '" '
            html_img += 'alt="Thumbnail ' + project.title + '" />'
          html_a_start = '<a href="#/' + portfolio["path_rel"] + project.filename + '" '
          html_a_start += 'title="Thumbnail ' + project.title + '">'
          html_a_end = project.title + '</a>'
          print(html_a_start + html_img + html_a_end, file=f)
        print('</div>', file=f)
        replaced = 1


def populate_sidebar(portfolio):
  """
  This file populates _sidebar.md with the portfolio links as children to 'PORTFOLIO/README.md'
  """
  # Read file and split lines; each line is a sidebar item
  with open(os.path.join(portfolio["path"], "_sidebar.md")) as f:
      contents = f.read()
  sidebar_items = contents.splitlines()
  # exchange portfolio items in sidebar, leave the rest as is
  sidebar_items_new = []
  for sidebar_item in sidebar_items:
    # check for parent
    if re.search(re.escape(portfolio["path_rel"]) + r'.*\.md', sidebar_item):
      if re.search(re.escape(portfolio["path_rel"]) + r'README\.md', sidebar_item):
        search = re.match(r'(\s*)[\*\-]\s*\[.*\]\(.*\).*', sidebar_item)
        indent = search.group(1) + "  "
        sidebar_items_new.append(sidebar_item)
        # add children
        for project in portfolio["projects"]:
          sidebar_items_new.append(indent + "* [" + project.title + "](" + portfolio["path_rel"] + project.filename + ")")
      else:
        continue
    else:
      sidebar_items_new.append(sidebar_item)
    # write to file
    with open(os.path.join(portfolio["path"], "_sidebar.md"), 'w') as f:
      for sidebar_item in sidebar_items_new:
        print(sidebar_item, file=f)


def docsify_rel_path(path, root = "docs", sep ="/"):
  """
  Determines paths relative to 'docs' as docsify root. If portfolio path given is already relative to 'docs',
  it will be used as is.
  """
  path_parts = path.split(os.sep)
  try:
    docs_index = path_parts.index(root.split(os.sep)[-1])
  except ValueError:
    docs_index = -1
  path_rel = ""
  for part in path_parts[docs_index+1:]:
    path_rel += part + sep
  return path_rel


def main():
  
  # parse cl args
  parser = argparse.ArgumentParser()
  parser.add_argument(
    "--portfolio_path",
    "-pp", 
    help="Path to the portfolio dir with all project md files.",
    type=str
  )
  parser.add_argument(
    "--rel_image_path",
    "-rip", 
    help="Relative path from the portfolio dir to the dir with all portfolio images. Defaults to 'img'.",
    type=str,
    default="img"
  )
  parser.add_argument(
    "--replace_tag",
    "-rt", 
    help="The tag marking the start and end lines of what is to be replaced in each markdown file by this program. Defaults to '<!-- portfolio-replace -->'",
    type=str,
    default="<!-- portfolio-replace -->"
  )
  args = dict(vars(parser.parse_args()))
  
  # get paths
  path = args["portfolio_path"]
  path_rel = os.path.abspath(path)
  if not os.path.exists(path_rel):
    path_abs = os.path.expanduser(os.path.normpath(path))
    if not os.path.exists(path_abs):
      raise FileNotFoundError("No portfolio directory found at: \n" + path_rel + " or \n" + path_abs + "\n")
    else:
      path = path_abs
  else:
    path = path_rel
  # set image dir
  image_path = os.path.join(path, args["rel_image_path"].lstrip('/\\'))
  if not (os.path.isdir(image_path)):
    raise FileNotFoundError("No image directory found at: \n" + image_path)
  # set replace tag default
  replace_tag = args["replace_tag"]
  
  # init portfolio and fill with info
  portfolio = dict(
    path = path,
    path_rel = docsify_rel_path(path),  # root is 'docs'
    image_path = image_path,
    image_path_rel = docsify_rel_path(image_path, root = path_rel),
    replace_tag = replace_tag,
    projects = []
  )
  get_projects(portfolio)
  get_images(portfolio)

  # populate project files, portfolio root, and sidebar
  populate_projects(portfolio)
  populate_root(portfolio)
  populate_sidebar(portfolio)

  # print
  print("Portfolio built.")


if __name__ == "__main__":
    main()