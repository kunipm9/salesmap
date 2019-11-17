# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand

import os
import os.path
import sys
import io
from pathlib import Path

from app.models import User, Company, FamilyRelationship, CustomTag, CustomTagCategory, Record
from plugins.usertag import utils as usertag_utils
from plugins.customtag import utils as customtag_utils
#import pyproj
 
#tokyo = pyproj.Proj(init='EPSG:4301') # 日本測地系 緯度経度
#wgs84 = pyproj.Proj(init='EPSG:4326') # WGS84 緯度経度

class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('owner_vendor_id', nargs=None, type=int)

    def handle(self, *args, owner_vendor_id, **options):

        usertaglist = []
        query = usertag_utils.get_users(tags=usertaglist, vendor=owner_vendor_id, paginate=False)

        # users = query.filter(longlat__intersects=polygon_search).exclude(building_shape__isnull=True).values(
        users = query.exclude(building_shape__isnull=True).values(

        # users = query.values(
                "id",
                "rank",
                "building_shape",
        )

        fname = "/tmp/data_pins.js"
        Path(fname).touch()
        os.remove(fname)
        with open(fname, 'w', encoding='utf8', errors='replace') as file:

            file.write("var docs = [\n")

            _id = 100000
            for user in users:
                _id += 1
                user_obj = query.filter(id=user['id']).first()
                user_building = User.to_building_context(user, user_obj)

                print(_id)
#                print(user_obj.__dict__)
#                print(user_obj.nickname)
#                print(user_building)

                nickname = user_obj.nickname
                kana = user_obj.last_kana + user_obj.first_kana
                rank = user_obj.rank

                tel1 = user_obj.tel1

                prefecture = user_obj.prefecture
                address1 = user_obj.address1
                address2 = user_obj.address2
                address3 = user_obj.address3
                address4 = user_obj.address4
                address5 = user_obj.address5

                xlist = user_building['x']
                ylist = user_building['y']
                posx = str(xlist[0])
                posy = str(ylist[0])
                polygon = ''
                for i in range(len(xlist)):
                    polygon += '[' + str(xlist[i]) + ', ' + str(ylist[i]) + '], '

                query_str = '''
{{
  "_id" : "a{_id}",
  "title" : "{nickname}",
  "residenceAddress" : {{
    "address" : {{
      "prefecture" : "{prefecture}",
      "addressCity" : "{address1}",
      "addressTown" : "{address2}",
      "addressNumber" : "{address3}",
      "addressBuilding" : "{address4}",
      "addressRoomNo" : "{address5}"
    }},
    "location" : {{
      "pos" : {{
        "type" : "Point",
        "coordinates" : [ 0, 0 ]
      }},
      "posTokyo" : {{
        "coordinates" : [ {posx}, {posy} ]
      }},
      "shape" : {{
        "type" : "building",
        "polygonWorld" : [ [ ] ],
        "polygonTokyo" : [ [ {polygon} ] ]
      }}
    }}
  }},
  "Users_Groups_id" : "7GEJoEyQiRQRz9S2j",
  "_deleted" : null,
  "modifiedAt" : 0,
  "createdAt" : 0,
  "createdBy" : "",
  "modifiedBy" : "",
}}
,
                '''.format(_id=_id, nickname=nickname, kana=kana, rank=rank, tel1=tel1, prefecture=prefecture, address1=address1, address2=address2, address3=address3, address4=address4, address5=address5, posx=posx, posy=posy, polygon=polygon)
#                print(query_str)
                
               # wpos = pyproj.transform(tokyo, wgs84, x[i], y[i])

                file.write(query_str)
                file.write("\n")

            file.write("];\n")
            file.write("module.exports = docs;\n")
